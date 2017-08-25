String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

let field1 = `■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■֍                        ■■■■  ■       ■         ■
■■■■■■■■■■■■■■           ■     ■■■               ■■
■    ■ ■ ■■  ■■■■   ■     ■■   ■              ■   ■
■     ■ ■       ■■■■■■■■ ■■■■    ■■               ■
■■    ■■  ■  ■               ■■    ■■   ■      ■  ■
■ ■     ■  ■■          ■■      ■■  ■■ ■  ■■■■     ■
■■ ■■  ■   ■■ ■ ■■ ■       ■ ■       ■■■   ■   ■■ ■
■ ■■  ■  ■  ■   ■     ■    ■    ■■ ■    ■■   ■    ■
■         ■       ■  ■ ■    ■■  ■ ■   ■    ■      ■
■ ■■ ■ ■  ■   ■ ■  ■     ■ ■ ■ ■  ■■         ■ ■  ■
■  ■ ■ ■■  ■        ■  ■■      ■  ■          ■    ■
■    ■■   ■ ■■ ■■    ■  ■   ■    ■    ■  ■■ ■■■ ■ ■
■■  ■ ■         ■■ ■ ■           ■      ■   ■ ■■  ■
■■■           ■■      ■     ■ ■ ■ ■■ ■  ■ ■■  ■  ■■
■■   ■       ■  ■   ■    ■■■      ■■       ■■     ■
■ ■              ■ ■             ■       ■      ■ ■
■   ■ ■ ■            ■ ■ ■  ■   ■■■  ■■■    ■ ■■  ■
■■■■■■■      ■         ■  ■               ■       ■
■            ■■  ■■  ■     ■ ■     ■■ ■ ■    ■    ■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■`;
field1 = field1.replaceAll(type.empty, type.track);
let field2 = `■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■֍oo■■■oooooooo■o■o■o■oo■o■ooooo■■oo■o■o■oooo■ooooo■ooooo■ooooooooo■■ooooooo■oo■ooooo■oooo■■ooo■ooooo■ooooo■oooo■oo■oooooooo■o■oooooo■oooo■oooooo■o■oooooooooooooo■ooooooo■
■oooooooooo■■oo■■■oo■ooo■o■oooooo■o■oooooooo■oo■ooooo■ooooo■oooooooo■■ooo■oooooooooo■o■o■■oooooo■■oooo■oooo■ooo■■■o■ooo■o■o■■oooooooo■■oo■ooooo■■oo■ooooo■oooooooooooooooo■
■oo■■o■■oooooo■ooo■oo■ooooooooo■■oo■o■oo■■ooooo■oo■■ooooooo■■oooooooooo■oooooo■■■ooooo■ooo■o■ooo■oo■ooo■■ooooooooo■■■o■■oooooo■ooo■ooooo■ooooo■■■■oo■o■oooo■oooooooooo■o■o■
■oooo■■oo■oooooo■■oo■ooo■o■o■o■■oo■oooo■ooo■oo■ooo■ooo■oooooooooo■ooo■oo■■■ooo■oo■ooo■ooooo■o■oooo■oooo■oo■oooooooo■oooooooooooo■oo■oo■■■ooo■oooooo■■■ooooooooo■oooooo■oo■■
■o■o■ooo■o■■■oo■ooooo■■oo■■o■■ooo■■oo■ooo■oooooooo■ooooooo■o■o■■o■ooo■ooo■■o■oooo■oo■oooooooooo■o■o■oo■o■■ooooooooo■ooo■o■ooooooooooooo■o■■oooooooooo■o■oo■ooo■o■ooo■■oooo■
■oooooooooooooo■oo■■oo■o■oooo■■oooooo■ooo■oooooooo■oo■ooooooooooooo■o■o■ooooo■■oo■oooooooo■oooooooooooooo■o■o■■■o■oooooooo■■■■oo■oooooo■o■ooo■■■o■■o■■oo■oooooo■oooooooooo■
■oo■o■■o■ooo■■ooooo■oooooooo■■■■oooooo■o■■oooooooooooo■oooooooooooooooooo■oooooooooooo■o■ooooo■■■■■oooooooo■ooooooo■ooo■o■■■oo■oooooo■ooooooo■ooooo■o■oooo■oo■o■oo■oooo■■o■
■oo■oo■oooo■ooooo■o■o■o■o■oo■oooo■■ooooo■■■oooo■o■o■oooooo■■ooooooo■ooo■■ooooo■o■o■ooo■o■oo■■oooooo■ooo■oooo■ooooo■■oo■oooooooooo■o■ooooo■oooooo■oooooooo■o■oooooooo■ooooo■
■■o■oooo■ooooooo■■ooo■oooo■■ooo■ooooo■o■■oooo■ooo■ooo■ooo■■■ooo■o■■oo■oooo■■ooo■o■o■o■oooo■ooo■oooo■ooooo■■oo■oo■oooooo■ooooo■o■oooo■■oo■ooooo■oooo■ooooo■o■oo■oooo■■■■ooo■
■oooooo■ooo■ooo■o■oooooo■■■oooooo■■oooo■oooooooooooooooo■ooooooo■ooo■■ooooooooooooooooo■oo■ooooooooo■oooooo■o■■■oooo■oo■ooo■ooooo■o■■o■oooo■■oooooooo■oo■o■oo■oo■o■oooo■oo■
■oo■■o■o■o■ooo■■■oo■■o■oo■■o■oooo■ooooooooooo■■oooooo■ooooooooooooooo■■oooo■o■■oo■oooo■o■o■o■ooooo■oo■■ooooooooooooooo■o■oooooooooooo■ooo■■ooooooo■ooooooooooooooooooooooo■
■o■oo■■ooooo■■■oo■oooooooooo■oooo■o■■■ooooo■■oooo■■ooo■o■■oooooo■ooooooooooo■oooo■oooooo■ooo■oooo■ooo■oooooo■o■oooooo■■■■oo■oooooooo■o■oo■■■■■oooooo■■o■ooo■ooo■oooooo■ooo■
■oooo■o■■oo■o■oooooooooo■o■■ooooo■■o■■oooooooo■ooooooooo■ooooo■■o■ooooo■ooooooo■ooo■oooo■oooo■oooo■ooooooo■■oooo■o■oooooooooo■oo■oooooooo■ooooo■ooooo■ooo■oooooooo■o■ooooo■
■ooooo■o■ooo■oo■oooo■o■■oooo■oo■oooooooooo■o■■oooooooo■o■oooo■oooo■■ooo■o■ooooooooooo■oooo■oooooooooooooooo■o■oo■ooo■ooooo■ooooooooo■■■oooo■ooooooo■ooo■oooooooooo■oo■oo■o■
■ooooo■oooo■oooo■ooooooooooo■■o■oo■ooooooooo■■o■ooooooooooo■ooooooo■■ooooooo■o■oooooo■■oooooooo■■■ooooooo■ooooooo■■oo■oooooooo■oo■o■oooo■ooo■oooooo■ooooooooo■■■■■oooooooo■
■■■o■o■■o■oo■o■■o■■■o■ooooo■oo■oooo■■■o■o■oooo■ooooo■oooo■ooo■■oo■■ooooooo■■■ooooooo■o■■oo■■oo■oooooo■■o■o■oo■o■oooooo■oooooooo■■oo■o■■■ooooo■o■oooooooo■oooo■ooooooo■■ooo■
■ooooooo■oooo■oooooo■oo■oooo■o■oo■oooooo■oo■o■oooooo■■oooo■ooo■o■ooooooooo■ooooo■oo■■ooo■■ooooo■ooo■o■o■■ooo■■■■o■■o■ooo■o■ooo■o■ooooo■o■■oooooooo■o■o■■o■oooooo■oooo■oo■o■
■oo■oooo■o■o■oooooo■oo■oooo■■■■oooooo■o■ooo■o■ooooooo■ooo■ooooo■o■oooooooooo■ooooooo■oo■oo■oooo■o■ooo■■■ooooo■■oooo■■ooo■ooooo■■■ooo■ooooo■oooo■oooooooo■o■ooooo■o■■o■o■oo■
■oooooooo■o■oooooo■■■ooooo■oooooo■oooooo■oo■ooooooooo■oo■ooo■oooooooo■■o■■oooooo■■o■■■oo■o■ooo■ooo■ooooo■oooo■oo■o■ooooooo■■oo■■oo■oo■ooo■o■ooooooooo■ooooo■ooo■■ooooooo■■■
■o■oooo■oo■o■■oooo■ooooooooooo■oooo■oooooo■o■ooooo■ooooo■o■■oo■ooo■o■o■oo■oo■oooo■ooo■■ooooooo■oooo■■oo■■ooooooooooo■oooooo■■ooooooo■oooooo■■■oo■oooooooo■■o■o■ooooooooooo■
■oo■ooooooooo■oooo■ooooo■oooo■■oo■ooo■ooooo■ooo■oooo■oooo■o■ooooo■ooooo■ooo■oo■■o■■■ooo■o■■oooo■oooooo■o■o■o■ooooooo■o■oooo■o■o■ooo■o■o■ooo■■ooooooooooooo■o■ooooooo■o■ooo■
■o■ooooo■oo■o■o■ooo■ooooo■oooooooo■ooooooo■oooooo■■■o■o■oooooooooo■ooo■o■ooooooooooooooooo■oo■■■o■oooo■oooooooooooooooooo■oo■■o■oo■oo■ooooo■ooooooo■ooo■■■ooo■oo■o■■ooooo■■
■oo■ooo■o■oooooo■o■■■ooo■oo■oo■ooooo■ooooooooooo■oo■ooo■■ooooooo■oooooooooooooo■oo■■oooooooo■oooooo■o■oo■■ooooooooo■oo■o■oo■ooooo■o■o■oo■ooooooooo■oooo■■oo■■ooooooo■o■■■■■
■ooooo■oo■oooooo■■■oooo■ooo■oo■oooooooo■■■ooooo■o■o■oooooo■ooo■oooooooooo■ooooooooooooo■oo■ooooo■ooo■■■ooo■o■o■■oooooo■oooo■oo■ooooooooo■o■■o■oooooo■ooooo■ooo■■oo■ooooooo■
■■o■oooo■■ooooo■o■■oo■o■ooooooooo■oo■oooo■o■oo■ooooo■■oo■■oooo■oo■ooooooooooo■ooo■oo■ooo■ooooo■oooo■oo■■oooo■ooooooo■■■ooo■ooo■■oooooooo■o■o■oooooooooooo■ooooo■oo■ooooo■o■
■oooooooooooo■ooooo■oooooo■ooo■o■o■oooooooo■■oo■■■oooo■oooooooooooooooooooo■o■oooo■■oo■■ooo■oooooooooo■o■o■■oooo■o■oo■oo■o■o■o■oooo■oooo■oooo■oooo■o■ooo■ooooooo■ooo■o■o■■■
■oo■oo■■■oooooooooo■■■ooooo■oo■ooooooo■ooo■oo■ooooooooooooo■o■oooooooooooooooooo■oo■o■oooo■o■■■oooo■ooooo■o■oo■■oo■ooooooooo■ooo■o■ooooo■oo■■ooooooooo■■o■o■■■oo■oo■■ooooo■
■oooo■oooooooo■■■■oooo■o■o■ooooooooooo■o■■oooo■o■o■■ooooo■oooooooo■o■■ooooooo■■o■ooo■oooooo■■oooooooooo■ooo■ooo■oooooo■oo■ooooo■ooooooooooooooo■■ooooooooooooo■oo■oo■oo■oo■
■oooooo■■oooooo■■ooooo■o■ooooooooooooo■oooo■■o■■oo■■oo■ooo■o■■■oo■oo■oooo■ooooooooooo■ooo■o■oo■oooooo■ooooo■oooo■o■■■oo■oooo■ooooooo■o■■oooooooooooooooooo■oooooooooo■o■oo■
■■ooo■■o■■oo■■ooooooooooo■■■■o■■■■ooooooooooooo■■■oooooooooooooo■oooooo■o■■ooo■■oo■■oooooooo■o■oooo■ooo■o■oo■ooooooooooo■ooo■oooooo■oo■oo■o■oo■oooooo■oo■o■■■o■oooooo■oooo■
■oo■ooooooooooo■■■■ooo■ooooooooo■o■■■■o■o■ooooooo■■ooo■ooooooo■o■ooo■oooooo■■ooo■■■■o■oo■oo■oooo■ooooooooo■■oooo■o■o■oo■oooooooo■oo■oooo■oooo■o■oooooo■oooooooooooooooo■oo■
■■oo■■o■■oooooo■oo■oo■ooooooo■■oo■■oooooooo■o■oooooooooooo■o■oooo■o■oo■■ooooo■■oooooo■■ooooo■oooo■ooooooooooo■■oooo■ooo■ooooooooooooo■o■■o■oo■ooooooooo■■oo■ooo■ooooooo■oo■
■oo■oo■oo■■oooo■o■o■oooo■ooooooo■o■■oo■oooo■■■oooo■oooo■oooooooo■oooooooo■ooo■oooooo■oo■ooooooo■oooooo■o■ooo■o■o■oooo■■ooo■■ooooo■■ooooo■■o■oo■ooooo■ooooooooooo■■ooo■■ooo■
■ooooo■oooo■ooo■oooo■ooooooo■o■oo■■oooooo■oo■oooo■oooooooooo■o■oooooooooo■ooooooo■oooooo■oooooo■■o■o■oooooooooo■ooooooooooo■■ooo■oo■oooooooooooo■oo■oooooooo■ooooooo■■ooo■■
■■oo■■o■oo■o■oooo■■oo■■ooooo■oooooooooo■■■o■o■■■oo■oo■o■o■oo■o■oo■ooooooooooooooooooooooo■o■ooo■■■o■oo■oooooooooo■oooo■■ooo■ooo■oooooo■ooooooooooooooo■o■oo■oooooooooooooo■
■oooo■oo■ooo■oooooooooooo■oo■oooo■ooooo■o■o■■ooooooooooooo■ooo■ooo■o■oo■o■ooooo■oooo■oo■oo■ooooo■■oo■■o■oooooo■oo■ooo■■ooo■■ooo■oooooooooooo■oooooo■ooooo■ooo■ooo■oooooooo■
■ooo■ooooooooooo■oo■o■ooo■oooooooooooo■oo■o■ooo■o■ooooooo■■■o■oo■ooo■■■oooooooo■■oo■o■ooo■■oo■oooooooooooo■oooooo■o■oo■o■ooo■ooo■ooooo■oo■ooo■oooo■o■o■o■■ooooooo■■ooooooo■
■ooooo■■oo■ooo■oo■ooo■o■■ooo■■oooooooooo■ooo■ooooo■oooooooo■■■■ooo■oooo■o■■oooooo■■ooooooo■ooo■oooooooo■ooo■oooo■oo■o■■ooooooooo■oooo■oo■■oooo■oooooooooooooooo■■oooo■oooo■
■o■ooooooo■oooo■■ooooooooooooo■■o■■ooo■ooooooo■oooo■o■ooo■ooooooo■■o■oo■o■oooo■ooooo■oooo■■■oooo■ooooo■■oooo■o■■■o■ooo■oooooooooooooooo■o■oooooooo■ooo■oo■oooo■oo■ooooooo■■
■oooo■o■o■oo■■ooooooo■o■ooooo■ooooo■ooo■■ooooo■o■oo■ooo■o■■ooooo■ooooooooooooo■oo■oooooo■■■■■oo■o■oo■■oo■oo■■■oooooo■o■■ooo■o■ooooo■oo■oo■■oo■o■o■oooooooo■■oo■ooooooooo■o■
■ooooo■ooo■■■■oooo■ooo■■o■ooooooooo■■ooooooooo■■oo■oo■oooo■oooo■o■ooo■oooo■■oooooooooooo■■■ooo■oo■■■ooooo■oo■oo■ooooooooo■ooooo■■ooooooooooooo■o■o■ooooooooooooo■ooooooooo■
■■ooooo■o■oo■■ooooo■o■o■oooooooo■oo■ooooo■■o■■■ooooo■oooooo■■oooooooo■■■■oooo■oooooo■■■oooo■o■oo■o■oooo■■■■■■oooooooo■oo■ooooo■■oooooooooooooo■ooooooo■■ooooo■oooo■ooo■ooo■
■oooooooooooooo■ooo■■■ooo■■ooo■oooo■ooooo■oo■o■ooo■■ooooooooooo■■■ooo■■oooooooo■■oo■ooo■oooo■oo■ooo■oooooo■■oo■oo■ooo■o■ooooooooooo■oooo■oooo■oooo■oooo■o■o■o■oo■o■■oooo■o■
■o■o■ooo■oo■ooo■oo■■oooo■oooooooooooo■ooo■ooooooooooooooooo■ooooo■oooooo■o■o■o■o■o■■oooooo■oooooooo■oo■■■o■o■■ooooooooooooooooo■ooooo■ooooo■oo■oooo■o■ooooooooo■■oo■o■■oo■■
■ooo■oooo■oooooo■■ooooooo■ooooooo■■oooo■■o■■ooooo■ooo■o■■o■ooooooo■o■ooooooooooooooooooo■ooooo■o■■oooooo■oooooooooo■ooo■ooooooooo■o■■oooooo■■■■ooooooooooo■■oo■■■o■■■ooooo■
■ooooo■■ooooooooo■■oo■ooooooooooo■ooooo■oo■■o■■■oo■oo■ooooo■oo■oooooo■oo■ooooooo■oooooo■oo■oooo■o■oooooooooo■oooooooooo■oo■oo■oooooooooooooo■ooo■oooooo■■ooooo■ooo■oo■oooo■
■o■o■ooo■oo■ooooooooooo■■oooooo■ooo■■oooooo■■ooo■■oo■ooooooooo■oo■oo■ooo■o■ooo■oooo■■ooooooo■oooooo■ooooo■ooo■■ooooooo■o■o■oooo■oo■o■ooo■ooo■o■oo■ooo■oooo■ooooo■■■ooo■oo■■
■oo■oooo■■■■oooo■■oo■■ooo■oooo■■oooo■■■oooo■oooooooooooo■ooooo■■ooo■o■■o■■oooooooo■oo■oooo■ooo■o■ooooo■ooooo■ooooooooooooooo■oooooooo■o■oooo■o■■oooo■oooo■ooooooooooooooo■■
■ooooooooooooooooooo■■ooooooooooooo■o■oo■oooo■■ooooo■oo■ooo■oo■ooo■ooooooo■ooo■o■oo■ooooo■oooo■ooo■■oo■■oo■o■oooo■■o■ooooooo■oooo■o■oooooo■■ooo■■oooooo■ooo■oooo■oooooooo ■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■`;

// field2 = generateField(50, 170);
// for (let rowI in field2) {
//     field2[rowI] = field2[rowI].map(v => v === type.empty ? type.track : v);
// }