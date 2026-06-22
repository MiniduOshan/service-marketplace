<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'worker_id',
        'service_package_id',
        'scheduled_at',
        'address',
        'notes',
        'total_price',
        'status',
        'cancel_reason',
        'payment_option',
        'advance_paid',
        'payout_status',
        'photos',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'total_price' => 'decimal:2',
            'photos' => 'array',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function servicePackage(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(BookingMessage::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        $showContact = in_array($this->status, ['confirmed', 'completed', 'accepted']);
        if (!$showContact) {
            if (isset($array['worker']) && is_array($array['worker'])) {
                $array['worker']['phone'] = 'Masked';
            }
            if (isset($array['customer']) && is_array($array['customer'])) {
                $array['customer']['phone'] = 'Masked';
            }
            
            if ($this->relationLoaded('worker') && $this->worker) {
                $this->worker->phone = 'Masked';
            }
            if ($this->relationLoaded('customer') && $this->customer) {
                $this->customer->phone = 'Masked';
            }
        }

        return $array;
    }
}