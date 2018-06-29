export default class Measure{
    constructor(){
        this.Expression = "";
        //this.Name ="";
        this.Properties=[];     
        
        this.DisplayFieldsOnForm=[];
    }

    toHtml() {
        var html="{";
        html += "Expression:'" + this.Expression + "'";//",DisplayName:'" + this.Name +"'";
        html += "}";

        return html;
    }
}