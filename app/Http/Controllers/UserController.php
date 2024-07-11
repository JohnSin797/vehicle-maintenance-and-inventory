<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\User\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('VMaI')->plainTextToken;
            return response()->json([
                'message' => 'login successful',
                'user' => $user,
                'token' => $token
            ]);
        }

        if(User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Password did not match'
            ], 401);
        }

        return response()->json([
            'message' => 'Email not found. Please sign up to register your account.'
        ], 401);
    }

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('VMaI')->accessToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ]);
    }
}
