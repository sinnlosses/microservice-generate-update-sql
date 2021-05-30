/**
 * 処理を実行する.
 */
 function execute():void{
    const inputText:string = getHtmlInputElementById("inputTextarea").value.trim();
    const inputRows:string[] = inputText.split("\n");
    const tableName:string = getHtmlInputElementById("tableName").value;
    const keyColumn:String = getHtmlInputElementById("keyColumn").value;
    let outputRows:string[] = new Array(inputRows.length);

    for (let i = 0; i < inputRows.length; i++){
        const splitedRows:string[] = identifySplitCharacter(inputRows[i]);
        const englishName:string = splitedRows[0].trim();
        const typeName:string = splitedRows[1].trim();
        const length:number = Number(splitedRows[2].trim());
        const keyColumnValue:String = splitedRows[3].trim();

        //データ定義が数値型、日付型の場合は処理しない
        if(["int" , "numeric" , "datetime" ].includes(typeName)){
            continue
        }
        //長さの定義がない場合と1の場合は飛ばす
        else if([" " , "" , "1"].includes(length.toString())){
            continue
        }
        //長さの定義が8以上の場合、改行の制御コードを入れたデータをSETするUPDATE文を作成する
        else if(length >= 8){
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = 'sei' + CHAR(13) + CHAR(10) + 'gyo' " + "\nWHERE " + keyColumn + " = " + keyColumnValue
            continue
        }
        //長さの定義が8より小さい場合、タブの制御コードを入れたデータをSETするUPDATE文を作成する
        else if (length > 2 && length < 8){
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = 's' + CHAR(9) + 'g' " + "\nWHERE " + keyColumn + " = " + keyColumnValue
            continue
        }
        else if(length == 2){
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = CHAR(9) + 's' " + "\nWHERE " + keyColumn + " = " + keyColumnValue
        }
    }
    
    outputRows = outputRows.filter(function(value){
        return value != "";
    });

    let outputTextarea:HTMLInputElement = <HTMLInputElement>document.getElementById("outputTextarea");
    outputTextarea.value = outputRows.join("\n\n");
}

/**
 * 指定したIDを持つエレメントを返す.
 * @param id エレメントID
 */
function getHtmlInputElementById(id:string):HTMLInputElement{
    return <HTMLInputElement>document.getElementById(id);
}

function identifySplitCharacter(inputRow:string):string[]{
    if (inputRow.split("\t").length >= 2){
        return inputRow.split("\t");
    } else {
        return inputRow.split(" ");
    }
}