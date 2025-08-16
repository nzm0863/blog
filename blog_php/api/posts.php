<?php
// CORS設定
ini_set('display_errors', 1);
   error_reporting(E_ALL);
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// エラーハンドリング
try {
    // データベース接続
    $dsn = 'mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8mb4';
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, 'nnzzm', 'NZMtomjerry0863', $options);
    
    // クエリ実行
    $stmt = $pdo->query('SELECT id, title, content, created_at FROM posts WHERE is_deleted = 0 ORDER BY created_at DESC');
    $posts = $stmt->fetchAll();
    
    // レスポンス
    echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    // エラーレスポンス
    http_response_code(500);
    echo json_encode([
        'error' => 'データベースエラーが発生しました',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    // その他のエラー
    http_response_code(500);
    echo json_encode([
        'error' => '予期せぬエラーが発生しました',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}