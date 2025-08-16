<?php
$id = (int)($_GET['id'] ?? 0);
if ($id === 0) {
  echo 'IDが不正です。';
  exit;
}

$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8mb4', 'nnzzm', 'NZMtomjerry0863');

// is_deletedを0に戻して復旧
$stmt = $pdo->prepare('UPDATE posts SET is_deleted = 0 WHERE id = ?');
$stmt->execute([$id]);

header('Location: index.php');
exit;
?>