<?php
$title = trim($_POST['title'] ?? '');
$content = trim($_POST['content'] ?? '');

if ($title === '' || $content === '') {
  echo 'タイトルと本文は必須です。';
  exit;
}

$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8', 'nnzzm', 'NZMtomjerry0863');
$stmt = $pdo->prepare('INSERT INTO posts (title, content) VALUES (?, ?)');
$stmt->execute([$title, $content]);

header('Location: index.php');
exit;
?>