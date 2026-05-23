<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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
        'password',
        'role',
        'primary_service_category_id',
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
            'password' => 'hashed',
        ];
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
