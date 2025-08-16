<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>新規記事投稿</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
  <h1>新規記事投稿</h1>
  <form action="create.php" method="post">
    <label>タイトル: <input type="text" name="title" required></label><br>
    <label>本文:<br>
      <textarea name="content" rows="10" cols="50" required></textarea>
    </label><br>
    <button type="submit">投稿する</button>
  </form>
    <p><a href="index.php">一覧に戻る</a></p>
  </div>
</body>
</html>