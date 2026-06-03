<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        $value = $setting->value;
        if ($key === 'credentials') {
            try {
                $value = Crypt::decryptString($value);
            } catch (\Exception $e) {
                // Return default or attempt unencrypted decode if decryption fails
            }
        }

        return json_decode($value, true) ?: $default;
    }

    public static function set(string $key, $value): void
    {
        $encodedValue = json_encode($value);
        if ($key === 'credentials') {
            $encodedValue = Crypt::encryptString($encodedValue);
        }

        self::updateOrCreate(
            ['key' => $key],
            ['value' => $encodedValue]
        );
    }
}
