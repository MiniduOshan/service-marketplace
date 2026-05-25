<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'google_id',
        'phone',
        'password',
        'role',
        'primary_service_category_id',
        'phone_verified_at',
        'phone_otp_hash',
        'phone_otp_expires_at',
        'api_token_hash',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
        'phone_otp_hash',
        'phone_otp_expires_at',
        'api_token_hash',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'phone_otp_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function normalizePhone(?string $phone): ?string
    {
        $normalized = preg_replace('/\D+/', '', (string) $phone);

        return $normalized !== '' ? $normalized : null;
    }

    public static function normalizeGoogleClientIds(mixed $clientIds): array
    {
        if (is_string($clientIds)) {
            $clientIds = explode(',', $clientIds);
        }

        if (! is_array($clientIds)) {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn ($clientId) => trim((string) $clientId),
            $clientIds
        )));
    }

    public function hasVerifiedPhone(): bool
    {
        return $this->phone_verified_at !== null;
    }

    public function markPhoneVerified(): void
    {
        $this->forceFill([
            'phone_verified_at' => now(),
            'phone_otp_hash' => null,
            'phone_otp_expires_at' => null,
        ])->save();
    }

    public function storePhoneOtp(string $otp, int $expiresInMinutes = 10): void
    {
        $this->forceFill([
            'phone_otp_hash' => Hash::make($otp),
            'phone_otp_expires_at' => now()->addMinutes($expiresInMinutes),
        ])->save();
    }

    public function verifyPhoneOtp(string $otp): bool
    {
        if (! $this->phone_otp_hash || ! $this->phone_otp_expires_at || $this->phone_otp_expires_at->isPast()) {
            return false;
        }

        return Hash::check($otp, $this->phone_otp_hash);
    }

    public function issueApiToken(): string
    {
        $plainTextToken = Str::random(64);

        $this->forceFill([
            'api_token_hash' => hash('sha256', $plainTextToken),
        ])->save();

        return $plainTextToken;
    }

    public function revokeApiToken(): void
    {
        $this->forceFill([
            'api_token_hash' => null,
        ])->save();
    }

    public function isWorker(): bool
    {
        return $this->role === 'worker';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}
