<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        try {
            if (!Schema::hasTable('settings')) {
                return $default;
            }

            $setting = self::where('key', $key)->first();
            if (!$setting) {
                return $default;
            }

            $value = $setting->value;
            if ($key === 'credentials') {
                try {
                    $value = Crypt::decryptString($value);
                } catch (\Throwable $e) {
                    return $default;
                }
            }

            $decoded = json_decode($value, true);
            return $decoded ?? $default;
        } catch (\Throwable $e) {
            return $default;
        }
    }

    public static function set(string $key, mixed $value): void
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
