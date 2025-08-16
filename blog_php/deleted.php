<?php
$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8', 'nnzzm', 'NZMtomjerry0863');
$stmt = $pdo->query('SELECT * FROM posts WHERE is_deleted = 1 ORDER BY created_at DESC');
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>削除済み記事一覧</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>削除済み記事一覧</h1>
    <ul>
      <?php foreach ($posts as $post): ?>
        <li>
          <?= htmlspecialchars($post['title']) ?>
          <a href="restore.php?id=<?= $post['id'] ?>">[復旧]</a>
        </li>
      <?php endforeach; ?>
    </ul>
    <p><a href="index.php">記事一覧に戻る</a></p>
  </div>
</body>
</html>