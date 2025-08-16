<?php
$id = (int)($_POST['id'] ?? 0);
$title = trim($_POST['title'] ?? '');
$content = trim($_POST['content'] ?? '');

if ($id === 0 || $title === '' || $content === '') {
  echo '全て必須です。';
  exit;
}

$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8mb4', 'nnzzm', 'NZMtomjerry0863');
$stmt = $pdo->prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?');
$stmt->execute([$title, $content, $id]);

header('Location: post.php?id=' . $id);
exit;
?>