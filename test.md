#***記念すべき第一回、型定義について***
date:"2025-08-13"

##JavaScriptの型定義(仮)の方法
TypeScriptはJavaScriptに型定義その他を加えたものだが、素のJavaScriptでも型定義もどきを行うことができると最近知ったので共有しようと思う。

因みにエディタはcursorを使っていて、記事の内容に関してもまんべんなくAIを使用していくのでそのつもりでよんでほしい。~~自分で全部書くよりAIに任せたほうが読むほうも安心なのではなかろうか~~

これは@paramという書き方らしい。

## @paramとは

`@param`は**JSDoc**というJavaScriptのドキュメント生成ツールで使用されるタグで、関数のパラメータ（引数）の説明を記述するために使われます。

### 基本的な@paramの記法

```javascript
/**
 * ユーザー情報を表示する関数
 * @param {string} name - ユーザーの名前
 * @param {number} age - ユーザーの年齢
 * @param {string} [email] - ユーザーのメールアドレス（オプション）
 * @returns {void}
 */
function displayUserInfo(name, age, email) {
    console.log(`名前: ${name}`);
    console.log(`年齢: ${age}`);
    if (email) {
        console.log(`メール: ${email}`);
    }
}

// 使用例
displayUserInfo("田中太郎", 25);
displayUserInfo("佐藤花子", 30, "hanako@example.com");
```

### 様々な@paramの使い方

#### 1. 基本的な型指定
```javascript
/**
 * 数値計算を行う関数
 * @param {number} a - 1つ目の数値
 * @param {number} b - 2つ目の数値
 * @param {string} operation - 演算子（'+', '-', '*', '/'）
 * @returns {number} 計算結果
 */
function calculate(a, b, operation) {
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : NaN;
        default: throw new Error('無効な演算子です');
    }
}

console.log(calculate(10, 5, '+')); // 15
console.log(calculate(10, 5, '*')); // 50
```

#### 2. オプショナルパラメータ
```javascript
/**
 * ユーザーを作成する関数
 * @param {string} name - ユーザー名（必須）
 * @param {number} [age] - 年齢（オプション）
 * @param {string} [email] - メールアドレス（オプション）
 * @returns {Object} ユーザーオブジェクト
 */
function createUser(name, age, email) {
    const user = { name };
    
    if (age !== undefined) {
        user.age = age;
    }
    
    if (email !== undefined) {
        user.email = email;
    }
    
    return user;
}

// 使用例
const user1 = createUser("田中太郎");
const user2 = createUser("佐藤花子", 25);
const user3 = createUser("山田次郎", 30, "yamada@example.com");

console.log(user1); // { name: "田中太郎" }
console.log(user2); // { name: "佐藤花子", age: 25 }
console.log(user3); // { name: "山田次郎", age: 30, email: "yamada@example.com" }
```

#### 3. 複数の型を許可
```javascript
/**
 * IDを検証する関数
 * @param {string|number} id - 文字列または数値のID
 * @param {Array<string>} validTypes - 有効なIDタイプの配列
 * @returns {boolean} 有効なIDかどうか
 */
function validateId(id, validTypes) {
    if (typeof id === 'string') {
        return validTypes.includes('string') && id.length > 0;
    } else if (typeof id === 'number') {
        return validTypes.includes('number') && id > 0;
    }
    return false;
}

console.log(validateId("user123", ["string", "number"])); // true
console.log(validateId(42, ["string", "number"]));       // true
console.log(validateId("", ["string", "number"]));       // false
```

#### 4. オブジェクトと配列の型指定
```javascript
/**
 * ユーザーリストを処理する関数
 * @param {Array<Object>} users - ユーザーオブジェクトの配列
 * @param {Object} filterOptions - フィルターオプション
 * @param {string} [filterOptions.name] - 名前でフィルター
 * @param {number} [filterOptions.minAge] - 最小年齢
 * @returns {Array<Object>} フィルターされたユーザーリスト
 */
function filterUsers(users, filterOptions) {
    return users.filter(user => {
        if (filterOptions.name && !user.name.includes(filterOptions.name)) {
            return false;
        }
        if (filterOptions.minAge && user.age < filterOptions.minAge) {
            return false;
        }
        return true;
    });
}

const users = [
    { name: "田中太郎", age: 25 },
    { name: "佐藤花子", age: 30 },
    { name: "山田次郎", age: 20 }
];

const filtered = filterUsers(users, { name: "田", minAge: 22 });
console.log(filtered); // [{ name: "田中太郎", age: 25 }]
```

## @paramの利点

1. **型安全性**: 実行時ではなく、開発時に型エラーを発見できる
2. **可読性**: 関数の使用方法が明確になる
3. **IDEサポート**: 多くのエディタで入力補完や型チェックが効く
4. **ドキュメント生成**: 自動的にAPIドキュメントを生成できる

## まとめ

`@param`を使うことで、TypeScriptを使わなくてもJavaScriptで型定義のような効果を得ることができます。特に、チーム開発やライブラリ開発では、コードの可読性と保守性を大幅に向上させることができます。


とのことらしい。ちなみに@param以外にも@returnというのがあるらしい。

## @paramと@returnの違い

### **@param（パラメータ）**
- **関数の入力**（引数）を説明
- 関数に渡される値の型と説明を記述

### **@return（戻り値）**
- **関数の出力**（戻り値）を説明
- 関数が返す値の型と説明を記述

## 両方を使った完全な例

```javascript
/**
 * ユーザーの年齢を計算する関数
 * @param {number} birthYear - 生年
 * @param {number} currentYear - 現在の年
 * @returns {number} 計算された年齢
 */
function calculateAge(birthYear, currentYear) {
    return currentYear - birthYear;
}

// 使用例
const age = calculateAge(1995, 2024);
console.log(age); // 29
```

## @returnの詳細な使い方

### 1. 基本的な戻り値の型指定
```javascript
/**
 * 文字列を大文字に変換する関数
 * @param {string} text - 変換する文字列
 * @returns {string} 大文字に変換された文字列
 */
function toUpperCase(text) {
    return text.toUpperCase();
}

console.log(toUpperCase("hello")); // "HELLO"
```

### 2. 複数の戻り値パターン
```javascript
/**
 * 数値を検証して結果を返す関数
 * @param {number} value - 検証する数値
 * @returns {Object} 検証結果オブジェクト
 * @returns {boolean} 検証結果オブジェクト.isValid - 有効かどうか
 * @returns {string} 検証結果オブジェクト.message - 結果メッセージ
 */
function validateNumber(value) {
    if (value > 0) {
        return {
            isValid: true,
            message: "正の数です"
        };
    } else {
        return {
            isValid: false,
            message: "正の数ではありません"
        };
    }
}

const result = validateNumber(42);
console.log(result.isValid);   // true
console.log(result.message);   // "正の数です"
```

### 3. 配列やオブジェクトの戻り値
```javascript
/**
 * ユーザーリストをフィルターする関数
 * @param {Array<Object>} users - ユーザー配列
 * @param {number} minAge - 最小年齢
 * @returns {Array<Object>} フィルターされたユーザー配列
 */
function filterUsersByAge(users, minAge) {
    return users.filter(user => user.age >= minAge);
}

const users = [
    { name: "田中太郎", age: 25 },
    { name: "佐藤花子", age: 30 },
    { name: "山田次郎", age: 20 }
];

const adults = filterUsersByAge(users, 25);
console.log(adults); // [{ name: "田中太郎", age: 25 }, { name: "佐藤花子", age: 30 }]
```

### 4. 戻り値がない場合（void）
```javascript
/**
 * ログを出力する関数
 * @param {string} message - 出力するメッセージ
 * @returns {void} 戻り値なし
 */
function logMessage(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

logMessage("アプリケーションが起動しました");
// 出力: [2024-01-15T10:30:00.000Z] アプリケーションが起動しました
```

## @paramと@returnの組み合わせ例

```javascript
/**
 * 完全なユーザー管理システム
 * @param {string} name - ユーザー名
 * @param {number} age - 年齢
 * @param {string} [email] - メールアドレス（オプション）
 * @returns {Object} 作成されたユーザーオブジェクト
 * @returns {string} 作成されたユーザーオブジェクト.id - ユーザーID
 * @returns {string} 作成されたユーザーオブジェクト.name - ユーザー名
 * @returns {number} 作成されたユーザーオブジェクト.age - 年齢
 * @returns {string|undefined} 作成されたユーザーオブジェクト.email - メールアドレス
 */
function createUser(name, age, email) {
    const userId = `user_${Date.now()}`;
    
    const user = {
        id: userId,
        name: name,
        age: age
    };
    
    if (email) {
        user.email = email;
    }
    
    return user;
}

// 使用例
const newUser = createUser("鈴木一郎", 28, "suzuki@example.com");
console.log(newUser);
// 出力例: { id: "user_1705312200000", name: "鈴木一郎", age: 28, email: "suzuki@example.com" }
```

## まとめ

- **@param**: 関数の入力（引数）を説明
- **@return**: 関数の出力（戻り値）を説明
- 両方を使うことで、関数の完全な仕様を記述できる
- 特に複雑な戻り値の場合は、詳細な説明が重要

こういうのもあるらしい。ちなみに@~は開発時のみ型定義してくれるもので、コメントアウトしてあるため出力時には効果をなさないようだ。最後にこの解説も載せておく。

## その他のJSDocタグ

JSDocには他にも多くの`@`タグがあります。それぞれの用途と使い方を紹介します。

### **@throws（例外）**
関数が投げる可能性のある例外を説明します。

```javascript
/**
 * 数値を安全に割り算する関数
 * @param {number} a - 被除数
 * @param {number} b - 除数
 * @returns {number} 割り算の結果
 * @throws {Error} 0で割り算しようとした場合
 */
function safeDivide(a, b) {
    if (b === 0) {
        throw new Error("0で割り算することはできません");
    }
    return a / b;
}

try {
    const result = safeDivide(10, 0);
} catch (error) {
    console.log(error.message); // "0で割り算することはできません"
}
```

### **@example（使用例）**
関数の使用例を示します。

```javascript
/**
 * 配列の合計を計算する関数
 * @param {Array<number>} numbers - 数値の配列
 * @returns {number} 合計値
 * @example
 * // 基本的な使用例
 * const sum = calculateSum([1, 2, 3, 4, 5]);
 * console.log(sum); // 15
 * 
 * // 空配列の場合
 * const emptySum = calculateSum([]);
 * console.log(emptySum); // 0
 */
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}
```

### **@deprecated（非推奨）**
非推奨の関数やメソッドを明示します。

```javascript
/**
 * 古い計算方法（非推奨）
 * @param {number} a - 1つ目の数値
 * @param {number} b - 2つ目の数値
 * @returns {number} 計算結果
 * @deprecated 代わりに {@link calculate} を使用してください
 */
function oldCalculate(a, b) {
    return a + b;
}

/**
 * 新しい計算方法
 * @param {number} a - 1つ目の数値
 * @param {number} b - 2つ目の数値
 * @returns {number} 計算結果
 */
function calculate(a, b) {
    return a + b;
}

// 使用例
// oldCalculate(5, 3); // 非推奨の警告が表示される
calculate(5, 3); // 推奨される方法
```

### **@typedef（型定義）**
カスタム型を定義します。

```javascript
/**
 * ユーザー情報の型定義
 * @typedef {Object} User
 * @property {string} id - ユーザーID
 * @property {string} name - ユーザー名
 * @property {number} age - 年齢
 * @property {string} [email] - メールアドレス（オプション）
 */

/**
 * ユーザーを作成する関数
 * @param {string} name - ユーザー名
 * @param {number} age - 年齢
 * @param {string} [email] - メールアドレス
 * @returns {User} 作成されたユーザー
 */
function createUser(name, age, email) {
    return {
        id: `user_${Date.now()}`,
        name,
        age,
        email
    };
}
```

### **@callback（コールバック関数）**
コールバック関数の型を定義します。

```javascript
/**
 * 数値処理のコールバック関数
 * @callback NumberProcessor
 * @param {number} value - 処理する数値
 * @returns {number} 処理結果
 */

/**
 * 配列の各要素に処理を適用する関数
 * @param {Array<number>} numbers - 数値の配列
 * @param {NumberProcessor} processor - 処理関数
 * @returns {Array<number>} 処理された配列
 */
function processNumbers(numbers, processor) {
    return numbers.map(processor);
}

// 使用例
const numbers = [1, 2, 3, 4, 5];
const doubled = processNumbers(numbers, (num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

### **@since（バージョン情報）**
機能が追加されたバージョンを記録します。

```javascript
/**
 * 新しい文字列処理機能
 * @param {string} text - 処理する文字列
 * @returns {string} 処理結果
 * @since 2.0.0
 */
function newStringProcessor(text) {
    return text.trim().toLowerCase();
}
```

### **@author（作者情報）**
コードの作者を記録します。

```javascript
/**
 * 高度な数学計算ライブラリ
 * @author 田中太郎 <tanaka@example.com>
 * @version 1.0.0
 * @since 2024-01-15
 */
class MathLibrary {
    /**
     * 円の面積を計算
     * @param {number} radius - 半径
     * @returns {number} 面積
     */
    static calculateCircleArea(radius) {
        return Math.PI * radius * radius;
    }
}
```

### **@link（関連リンク）**
関連する関数やクラスへのリンクを作成します。

```javascript
/**
 * ユーザー認証を行う関数
 * @param {string} username - ユーザー名
 * @param {string} password - パスワード
 * @returns {boolean} 認証成功かどうか
 * @see {@link createUser} ユーザー作成
 * @see {@link updateUser} ユーザー更新
 */
function authenticateUser(username, password) {
    // 認証ロジック
    return true;
}
```

## よく使う@タグのまとめ

| タグ | 用途 | 例 |
|------|------|-----|
| `@param` | パラメータの説明 | `@param {string} name - ユーザー名` |
| `@returns` | 戻り値の説明 | `@returns {number} 計算結果` |
| `@throws` | 例外の説明 | `@throws {Error} エラーメッセージ` |
| `@example` | 使用例 | `@example` |
| `@deprecated` | 非推奨の明示 | `@deprecated 代わりに...` |
| `@typedef` | 型定義 | `@typedef {Object} User` |
| `@callback` | コールバック関数 | `@callback NumberProcessor` |
| `@since` | バージョン情報 | `@since 2.0.0` |
| `@author` | 作者情報 | `@author 田中太郎` |
| `@link` | 関連リンク | `@see {@link functionName}` |

## 実際の開発での活用例

```javascript
/**
 * 完全なドキュメント付き関数
 * @author 開発者名
 * @version 1.0.0
 * @since 2024-01-15
 * @param {string} input - 入力文字列
 * @param {Object} options - オプション設定
 * @param {boolean} [options.uppercase=false] - 大文字変換するか
 * @returns {string} 処理された文字列
 * @throws {Error} 無効な入力の場合
 * @example
 * const result = processText("hello", { uppercase: true });
 * console.log(result); // "HELLO"
 * @deprecated 代わりに {@link newProcessText} を使用
 * @see {@link newProcessText} 新しい処理関数
 */
```

なんかいっぱいあるみたい。こんなの知らなかった。

こんな感じらしい。「らしい」ばっかりで申し訳ない。ここまで見て超初心者な疑問が浮かんだ。JSDocってなに？と。JavaScriptの何かかな？
長くなって投稿ができなくなってしまったので続きは次回に。
