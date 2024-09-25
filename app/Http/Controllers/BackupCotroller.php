<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Backup\Backup;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;


class BackupController extends Controller
{
    public function downloadBackup()
    {
        // try {
        //     // إنشاء نسخة احتياطية
        //     Artisan::call('backup:run --only-db');

        //     // تحديد مسار النسخة الاحتياطية
        //     $path = storage_path('app/' . now()->format('Y-m-d-H-i-s') . '-backup.zip');

        //     // العثور على أحدث ملف نسخة احتياطية
        //     $files = Storage::files('backups');
        //     $latestBackup = end($files);

        //     // تنزيل النسخة الاحتياطية
        //     if (File::exists(storage_path('app/' . $latestBackup))) {
        //         return response()->download(storage_path('app/' . $latestBackup));
        //     } else {
        //         return response()->json(['message' => 'Backup file not found.'], 404);
        //     }
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Failed to create or download backup: ' . $e->getMessage(),
        //     ], 500);
        // }
    }
}
