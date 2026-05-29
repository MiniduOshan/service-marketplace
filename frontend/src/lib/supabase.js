const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'service-images';

export async function uploadImageToSupabase(file, folder = 'service-packages') {
  if (!file) {
    throw new Error('Please select an image to upload.');
  }

  if (!file.type?.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
  const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
  const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${supabaseBucket}/${encodeURIComponent(fileName)}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': file.type,
      'x-upsert': 'false',
    },
    body: file,
  });

  if (!response.ok) {
    let errorMessage = 'Failed to upload image.';

    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorBody?.error || errorMessage;
    } catch {
      // Ignore non-JSON error bodies.
    }

    throw new Error(errorMessage);
  }

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${supabaseBucket}/${fileName}`;
}