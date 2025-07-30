<?php

namespace App\Policies;

use App\Models\SalesTarget;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SalesTargetPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SalesTarget $salesTarget): bool
    {
        return $user->role === 'admin' ||
            ($user->role === 'manager' &&
                $user->region_id == $salesTarget->region_id &&
                $user->channel_id == $salesTarget->channel_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SalesTarget $salesTarget): bool
    {
        return $this->view($user, $salesTarget);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SalesTarget $salesTarget): bool
    {
        return $this->view($user, $salesTarget);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SalesTarget $salesTarget): bool
    {
        return $this->view($user, $salesTarget);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SalesTarget $salesTarget): bool
    {
        return $user->role === 'admin';
    }
}
