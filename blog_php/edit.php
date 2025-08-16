<?php
$pdo = new PDO('mysql:host=mysql80.nnzzm.sakura.ne.jp;dbname=nnzzm_blog_db;charset=utf8', 'nnzzm', 'NZMtomjerry0863');
$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ?');
$stmt->execute([$id]);
$post = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$post) {
  echo '記事が見つかりません';
  exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>記事編集</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>記事編集</h1>
    <form action="update.php" method="post">
      <input type="hidden" name="id" value="<?= $post['id'] ?>">
      <label>タイトル: <input type="text" name="title" value="<?= htmlspecialchars($post['title']) ?>" required></label><br>
      <label>本文:<br>
        <textarea name="content" rows="10" cols="50" required><?= htmlspecialchars($post['content']) ?></textarea>
      </label><br>
      <button type="submit">更新する</button>
    </form>
    <p><a href="index.php">一覧に戻る</a></p>
  </div>
</body>
</html>