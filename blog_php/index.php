<?php
$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8', 'nnzzm', 'NZMtomjerry0863');
$stmt = $pdo->query('SELECT * FROM posts WHERE is_deleted = 0 ORDER BY created_at DESC');
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ブログ記事一覧</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
  <h1>ブログ記事一覧</h1>
  <p><a href="new.php">新規記事投稿</a></p>
  <ul>
    <?php foreach ($posts as $post): ?>
      <li>
        <a href="post.php?id=<?= $post['id'] ?>">
          <?= htmlspecialchars($post['title']) ?>
        </a>
        <span><?= $post['created_at'] ?></span>
        <a href="edit.php?id=<?= $post['id'] ?>">編集</a> |
<a href="delete.php?id=<?= $post['id'] ?>" onclick="return confirm('本当に削除しますか？');">削除</a>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
</body>
</html>