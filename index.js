
var fs = require("fs");
var esprima = require('esprima');
var estraverse = require('estraverse');
var source = fs.readFileSync("page.js", "utf-8");


function aMap() {
    this.value = {};
    this.name = new Array();
}

function aArray(){
    Array.call();
}

aArray.prototype = new Array();
aArray.prototype.am_new = function (name) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == name) {
            return
        }
    }
    this.push(name)
}

aMap.prototype.am_new = function (name) {
    var len = this.name.length;
    for (var i = 0; i < len; i++) {
        if (this.name[i] == name) {
            return
        }
    }
    this.name.push(name)
}
aMap.prototype.am_check = function (name) {
    var len = this.name.length;
    for (var i = 0; i < len; i++) {
        if (this.name[i] == name) {
            return i;
        }
    }
    return -1;
}



aMap.prototype.am_add = function (name, value) {
    var len = this.name.length;
    this.value[name] = value;
    for (var i = 0; i < len; i++) {
        if (this.name[i] == name) {
            return
        }
    }
    this.name.push(name)
}

aMap.prototype.am_name = function () {
    return this.name
}
aMap.prototype.am_value = function (name) {
    return this.value[name]
}


function ScriptObj() {
    this.funlist = new aMap();
}

ScriptObj.FUNCTION = "FUNCTION";
ScriptObj.EXPRESSION = "EXPRESSION";

ScriptObj.prototype.InsertFunc = function (name, params, block) {
    var func_obj = null;
    if (this.funlist.am_check(name) == -1) {
        this.funlist.am_add(name, new funcObj(name));
    }

    func_obj = this.funlist.am_value(name);
    if (func_obj.name == name) {
        func_obj.setFunc(name, params, block);
    } else {
        console.log("InsertFunc Error");
    }
}

ScriptObj.prototype.InsertExpress = function (type, classname, name, right) {
    var func_obj = null;
    if (this.funlist.am_check(classname) == -1) {
        this.funlist.am_add(classname, new funcObj(classname));
    }

    func_obj = this.funlist.am_value(classname);
    if (func_obj.name == classname) {
        if (type == "prototype") {
            func_obj.setSelfExpress(name, right);
        } else {
            func_obj.setClassExpress(name, right);
        }

    } else {
        console.log("InsertExpress Error");
    }

}


function funcObj(name) {
    this.name = name;
    this.params = new Array();
    this.block = null;
    this.classdat = new aMap();
    this.selfdat = new aMap();
}

var t_ptotal = 0;
function ParseBlock(block, debug) {
    var self_dat = new Array();
    /*
    for(var i=0;i<block.body.length;i++)
    {
        switch (block.body[i].type){
            case "ExpressionStatement":
            case "ForStatement":
            case "IfStatement":
            case "ReturnStatement":
            case "SwitchStatement":
            case "WhileStatement":
            case "VariableDeclaration":
            {

            }break;
            default: {
                //console.log(block.body[i].type);
            } break;
        }
    }
    return;*/
    var block_obj = {};
    block_obj.calls = new aMap();
    block_obj.vars = new aMap();
    block_obj.classs = new aMap();
    block_obj.selfs = new aMap();
    block_obj.debugs = new aMap();

    var a_debug = debug, b_debug = 0, node_debug = 0;
    var a_count = 0, b_count = 0;
    var count = 0;
    estraverse.traverse(block, {
        enter: function (node) {
            count++;
            if (node_debug)
                console.log(count);
            if (node_debug)
                console.log(node);
            //console.log("");

            switch (node.type) {


                case "ConditionalExpression": {
                    if (node.alternate.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("ConditionalExpression a: ", a_count, node.alternate.name);
                        block_obj.vars.am_new(node.alternate.name, node.alternate.name);
                    }
                    if (node.consequent.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("ConditionalExpression a: ", a_count, node.consequent.name);
                        block_obj.vars.am_new(node.consequent.name, node.consequent.name);
                    }
                    if (node.test.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("ConditionalExpression a: ", a_count, node.test.name);
                        block_obj.vars.am_new(node.test.name, node.test.name);
                    }
                } break;

                case "VariableDeclarator": {
                    if (node.id.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("VariableDeclarator a: ", a_count, node.id.name);

                        block_obj.vars.am_new(node.id.name, node.id.name);
                    }
                    if ((node.init) && (node.init.type == "Identifier")) {
                        a_count++;
                        if (a_debug)
                            console.log("VariableDeclarator a: ", a_count, node.init.name);
                        block_obj.vars.am_new(node.init.name, node.init.name);
                    }

                } break;
                case "IfStatement": {
                    if (node.test.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("IfStatement a: ", a_count, node.test.name);

                        block_obj.vars.am_new(node.test.name, node.test.name);
                    }
                } break;



                case "SwitchStatement": {
                    if (node.discriminant.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("SwitchStatement a: ", a_count, node.discriminant.name);
                        block_obj.vars.am_new(node.discriminant.name, node.discriminant.name);
                    }
                } break;
                case "Property": {
                    if (node.key.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("Property a: ", a_count, node.key.name);
                        block_obj.vars.am_new(node.key.name, node.key.name);
                    }

                    if (node.value.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("Property a: ", a_count, node.value.name);

                        block_obj.vars.am_new(node.value.name, node.value.name);
                    }
                } break;
                case "FunctionExpression": {
                    if ((node.id) && (node.id.type == "Identifier")) {
                        a_count++;
                        if (a_debug)
                            console.log("FunctionExpression a: ", a_count, node.id.name);
                        block_obj.vars.am_new(node.id.name, node.id.name);
                    }
                    for (var j = 0; j < node.params.length; j++) {
                        if (node.params[j].type == "Identifier") {
                            a_count++;
                            if (a_debug)
                                console.log("FunctionExpression a: ", a_count, node.params[j].name);
                            block_obj.vars.am_new(node.params[j].name, node.params[j].name);
                        }
                    }
                } break;

                case "ArrayExpression": {
                    for (var j = 0; j < node.elements.length; j++) {
                        if (node.elements[j].type == "Identifier") {
                            a_count++;
                            if (a_debug)
                                console.log("ArrayExpression a: ", a_count, node.elements[j].name);
                            block_obj.vars.am_new(node.elements[j].name, node.elements[j].name);
                        }
                    }
                } break;

                case "NewExpression":
                case "CallExpression":
                    {
                        if (node.callee.type == "Identifier") {
                            a_count++;
                            if (a_debug)
                                console.log("N-C Call a: ", a_count, node.callee.name);

                            block_obj.calls.am_new(node.callee.name, node.callee.name);
                        }

                        for (var j = 0; j < node.arguments.length; j++) {
                            if (node.arguments[j].type == "Identifier") {
                                a_count++;
                                if (a_debug)
                                    console.log("N-C arguments a: ", a_count, node.arguments[j].name);
                                block_obj.vars.am_new(node.arguments[j].name, node.arguments[j].name);
                            }
                        }
                    }
                    break;

                case "AssignmentExpression":
                case "BinaryExpression":
                case "ForInStatement":
                case "LogicalExpression":
                    {
                        if (node.left.type == "Identifier") {
                            a_count++;
                            if (a_debug)
                                console.log("A-B-F-L a: ", a_count, node.left.name);
                            block_obj.vars.am_new(node.left.name, node.left.name);
                        }

                        if (node.right.type == "Identifier") {
                            a_count++;
                            if (a_debug)
                                console.log("A-B-F-L a: ", a_count, node.right.name);

                            block_obj.vars.am_new(node.right.name, node.right.name);
                        }
                    }
                    break;

                case "ReturnStatement":
                case "UpdateExpression":
                case "UnaryExpression":
                    {
                        if ((node.argument) && (node.argument.type == "Identifier")) {
                            a_count++;
                            if (a_debug)
                                console.log("R-U-U a: ", a_count, node.argument.name);
                            block_obj.vars.am_new(node.argument.name, node.argument.name);
                        }
                    }
                    break;
                case "StaticMemberExpression":
                case "MemberExpression":
                    {
                        switch(node.object.type)
                        {
                            case "ThisExpression":{
                                if (node.property.type == "Identifier") {
                                    a_count++;
                                    if (a_debug)
                                        console.log("S-M this: ", a_count, node.property.name);
                                    block_obj.selfs.am_new(node.property.name, node.property.name);
                                }
                            }break;

                            case "Identifier":{
                                if (node.object.type == "Identifier") {
                                    a_count++;
                                    if (a_debug)
                                        console.log("S-M a: ", a_count, node.object.name);                          
                                }
                                if (node.property.type == "Identifier") {
                                    a_count++;
                                    if (a_debug)
                                        console.log("S-M a: ", a_count, node.property.name);
                                }
                                var class_name = node.object.name +"."+node.property.name;
                                block_obj.classs.am_new(class_name, class_name);
                            }break;
                            default:{
                                if (node.object.type == "MemberExpression") 
                                {
                                    console.log("Finde:  MemberExpression");
                                }
                                else
                                {
                                    console.log("Finde: ",node.object.type);
                                    if (node.property.type == "Identifier") {
                                        a_count++;
                                        if (a_debug)
                                            console.log("S-M a: ", a_count, node.property.name);
                                        block_obj.vars.am_new(node.property.name, node.property.name);
                                    }
                                }
                                
                                
                            }
                            break;
                        }
                        

                        


                    }
                    break;
                case "CatchClause": {
                    if (node.param.type == "Identifier") {
                        a_count++;
                        if (a_debug)
                            console.log("CatchClause a: ", a_count, node.param.name);
                        block_obj.vars.am_new(node.param.name, node.param.name);
                    }
                } break;


                case "Identifier":
                    {
                        b_count++;
                        if (b_debug)
                            console.log("b: ", b_count, node.name);

                        block_obj.debugs.am_new(node.name, node.name);
                    }
                    break;
                default: {
                    //console.log(count, " ------------- ");
                    //console.log(node);
                }
                    break;
            }
        }
    });


    if (a_count != b_count) {
        console.log("ERROR");
        console.log(" a: ", a_count, " b: ", b_count);
    }
    if(a_debug)
    console.log(" a: ", a_count, " b: ", b_count);
    return block_obj;
    //
}
funcObj.prototype.setFunc = function (name, params, block) {


    t_ptotal++;
    console.log("====  ID:              ", t_ptotal);
    if (t_ptotal == 16) {

        this.params = params;
        this.block = ParseBlock(block, 1);

        console.log("====  Function Name:   ", this.name);
        console.log("====  Params:          ", this.params);
        console.log("====  Class dat:       ", this.classdat);
        console.log("====  Self dat:        ", this.selfdat);
        console.log("====  Block:           ", this.block);
    }
}

funcObj.prototype.createblock = function (right) {
    var block_obj = {};
    switch (right.type) {
        case "FunctionExpression": {
            block_obj.type = "funct";
            block_obj.params = new Array();
            for (var j = 0; j < right.params.length; j++) {
                block_obj.params.push(right.params[j].name);
            }
            //block_obj.block = ParseBlock(right.body);


            //block_obj.block = right.body;
        } break;
        case "Literal": {
            block_obj.type = "literal";
        } break;
        case "NewExpression": {
            block_obj.type = "literal";
            block_obj.cale = right.callee.name;
        } break;
        case "BinaryExpression": {
        } break;
        case "ObjectExpression": {
        } break;
        case "ArrayExpression": {
        } break;
        default: {
            newFunction(right);
        } break;
    }
    return block_obj;
}

funcObj.prototype.setClassExpress = function (name, right) {
    if (this.classdat.am_check(name) == -1) {
        this.classdat.am_new(name, this.createblock(right));
    }

}

funcObj.prototype.setSelfExpress = function (name, right) {
    if (this.selfdat.am_check(name) == -1) {
        this.selfdat.am_new(name, this.createblock(right));
    }
}



var ast = esprima.parse(source);

var scriptro = new ScriptObj();
parse(scriptro, ast);

function parse(srcipt_obj, obj) {
    this.type = obj.type;
    this.body = obj.body;

    for (var i = 0; i < this.body.length; i++) {
        var item_obj = this.body[i];
        if (item_obj) {
            switch (item_obj.type) {
                case "FunctionDeclaration": {
                    var obj = {};
                    obj.name = item_obj.id.name;
                    obj.params = new Array();
                    for (var j = 0; j < item_obj.params.length; j++) {
                        obj.params.push(item_obj.params[j].name);
                    }
                    obj.block = item_obj.body;
                    srcipt_obj.InsertFunc(obj.name, obj.params, obj.block);

                } break;
                case "ExpressionStatement": {
                    var obj = {}
                    switch (item_obj.expression.type) {
                        case "AssignmentExpression": {
                            if (item_obj.expression.left.type == "Identifier") {
                                //console.log("AssignmentExpression",item_obj.expression.left.name);
                            }
                            else if ("MemberExpression") {
                                switch (item_obj.expression.left.object.type) {
                                    case "MemberExpression": {
                                        obj.classname = item_obj.expression.left.object.object.name;
                                        obj.propertyname = item_obj.expression.left.object.property.name;
                                        obj.name = item_obj.expression.left.property.name;
                                        obj.right = item_obj.expression.right;
                                        srcipt_obj.InsertExpress(obj.propertyname, obj.classname, obj.name, obj.right);
                                    } break;
                                    case "Identifier": {
                                        obj.classname = item_obj.expression.left.object.name;
                                        obj.name = item_obj.expression.left.property.name;
                                        obj.right = item_obj.expression.right;
                                        srcipt_obj.InsertExpress("", obj.classname, obj.name, obj.right);
                                    } break;
                                    default: {

                                    } break;

                                }
                            }

                        } break;
                        case "MemberExpression": {
                            switch (item_obj.expression.object.type) {
                                case "MemberExpression": {
                                    //console.log(item_obj.expression.type,item_obj.expression.object.object.name,item_obj.expression.object.property.name,item_obj.expression.property.name);
                                } break;
                                case "Identifier": {
                                    //console.log(item_obj.expression.type,item_obj.expression.object.name,item_obj.expression.property.name);
                                } break;
                                default: {
                                    console.log("MemberExpression Other");
                                } break;

                            }
                        } break;

                        default: {
                            console.log("ExpressionStatement", item_obj.expression.type);
                        } break;
                    }



                } break;
                case "VariableDeclaration": {
                    for (var j = 0; j < item_obj.declarations.length; j++) {
                        //console.log("var",item_obj.declarations[j].id.name);
                    }
                } break;
                default: {
                    console.log(i, "ScriptObj", item_obj);
                } break;
            }
        }
    }
    //console.log("Dat", JSON.stringify(scriptro.funlist))
}

function newFunction(right) {
    console.log("Other Type", right);
}

