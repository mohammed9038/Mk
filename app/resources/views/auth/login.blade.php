<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <title>{{ __('messages.Login') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container py-5">
    <form method="POST" action="{{ route('login.perform') }}" class="mx-auto" style="max-width:400px;">
        @csrf
        <div class="mb-3">
            <label class="form-label">{{ __('messages.Username') }}</label>
            <input type="text" name="username" class="form-control" required autofocus>
        </div>
        <div class="mb-3">
            <label class="form-label">{{ __('messages.Password') }}</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        @if($errors->any())
            <div class="alert alert-danger">{{ $errors->first() }}</div>
        @endif
        <button type="submit" class="btn btn-primary">{{ __('messages.Login') }}</button>
    </form>
    <div class="mt-3 text-center">
        <a href="?lang=ar">{{ __('messages.Arabic') }}</a> |
        <a href="?lang=en">{{ __('messages.English') }}</a>
    </div>
</body>
</html>
