<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 記事投稿処理
    try {
        $dsn = 'mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, 'nnzzm', 'NZMtomjerry0863', $options);

        // JSONデータを受け取る
        $data = json_decode(file_get_contents("php://input"), true);
        
        $id = $data["id"] ?? "";
        $title = $data["title"] ?? "";
        $content = $data["content"] ?? "";
        $image_url = $data["image_url"] ?? "";
        $encoding = $data["encoding"] ?? "";

        // エンコーディング方式に応じて復元
        if ($encoding === "gzip-base64") {
            $content = gzdecode(base64_decode($content));
        }

        if (empty($title) || empty($content)) {
            throw new Exception('タイトルと本文は必須です');
        }

        // DBに記事を保存
        $stmt = $pdo->prepare('INSERT INTO posts (title, content, image_url, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$title, $content, $image_url]);
        $id = $pdo->lastInsertId();

        echo json_encode(['success' => true, 'id' => $id], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'データベースエラー: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 記事取得処理（既存のコード）
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'IDが指定されていません']);
        exit();
    }
    try {
        $dsn = 'mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, 'nnzzm', 'NZMtomjerry0863', $options);
        $stmt = $pdo->prepare('SELECT id, title, content, image_url, created_at FROM posts WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode($row, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => '記事が見つかりません']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'データベースエラー: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}