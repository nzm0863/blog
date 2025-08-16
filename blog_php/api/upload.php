<?php
// エラー表示を有効化（デバッグ用）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORSヘッダーの設定
header('Access-Control-Allow-Origin: http://nnzzm.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONSリクエストの場合は早期リターン
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POSTリクエスト以外はエラー
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // 画像保存先をサーバー上の絶対パスに固定
    $upload_dir = '/home/nnzzm/www/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => '画像がアップロードされていません']);
        exit();
    }

    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $targetFile = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imageUrl = '/uploads/' . $filename;
        echo json_encode(['success' => true, 'image_url' => 'https://www.nnzzm.com' . $imageUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '画像の保存に失敗しました']);
    }

} catch (Exception $e) {
    // エラーレスポンス
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} 