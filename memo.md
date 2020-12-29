## データについて

* CSV/TSV形式ではデータの
  * [重要] セル内改行によりCSV/TSV共にデータが壊れる
  * シートの結合により、２行にわたる見出し部分の紐付けが難しい


## 開発メモ

### Chart.js

#### Range bar -> Float Bar

[Add support for floating bar chart \(\[start, end\]\) by gwyneblaidd · Pull Request \#6056 · chartjs/Chart\.js](https://github.com/chartjs/Chart.js/pull/6056)

[javascript \- Is there any way to display float bar in chart\.js? \- Stack Overflow](https://stackoverflow.com/questions/55723654/is-there-any-way-to-display-float-bar-in-chart-js)

#### v3
v3からesm(ES Module)形式でも利用可能になり、クラスベースでコードを書けるようになるが、2020/12現在ベータ版であり、情報もなくうまく動かせなかったので利用は保留。(`XXXController`など、必要な要素を`Chart.register(...)`で登録していかなくてはならないが、何を登録すべきか全くわからなかった)
とりあえずはプロトタイプベースでclass化して作っていく。v3が使えそうなら移行する。

#### tooltip
* Tooltipに追加情報を表示することもできそうだが、表示項目名を指定する方法が思いつかないため保留


### エラー

#### (SheetJS) Uncaught (in promise) Error: Cannot find file [Content_Types].xml in zip

ファイル読み込み時に発生。

→ `xlsx.min.js`でなく、`xlsx.full.min.js`を利用することで解決

https://github.com/SheetJS/sheetjs/issues/1803
> It looks like you might be using the xlsx.min.js file directly. If you are using a script tag, can you reference xlsx.full.min.js from the dist directory?