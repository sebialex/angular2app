export class DAOService {            
        
    actions = ["buy", "sell", "rent"];
    items = ["socks", "shoes", "pants", "jacket", "handbag"];
    actionMap: Map<string,string>;
    itemMap: Map<string,string>;
    properties: Map<string,string []>;
    propertiesMap: Map<string, Map<string,string>>;
    
    constructor() {
       this.properties = new Map<string,string []>();
             
       this.properties.set("shoes", ["running", "derby", "slipper", "moccasin", "jelly"]);
       this.properties.set("handbag", ["bucket", "box", "satchel", "sling", "shoulder"]);
       this.properties.set("pants", ["28", "29", "30", "31", , "32" , "33"]);
       this.properties.set("socks", ["black", "blue", "brawn", "green", "red"]);
       this.properties.set("jacket", ["small", "medium", "large"]);
       
       this.propertiesMap = new Map<string, Map<string,string>>();
       this.propertiesMap.set("shoes", this.getMap(this.properties.get("shoes")));
       this.propertiesMap.set("handbag", this.getMap(this.properties.get("handbag")));
       this.propertiesMap.set("pants", this.getMap(this.properties.get("pants")));
       this.propertiesMap.set("socks", this.getMap(this.properties.get("socks")));
       this.propertiesMap.set("jacket", this.getMap(this.properties.get("jacket")));
       
       this.actionMap = this.getMap(this.actions);
       this.itemMap = this.getMap(this.items);     
    }
    
    getActions(queryString: string): string [] {                       
        return this.getListThatMatches(this.actions, queryString);
    }
    
    getItems(queryString: string): string [] {     
        return this.getListThatMatches(this.items, queryString);
    }
    
    getProperties(item: string, queryString: string): string [] { 
        return this.getListThatMatches(this.properties[item], queryString);              
    }
    
    isActionValid(action: string): boolean {
        return (this.actionMap.get(action) == "TRUE");
    }
    
    isItemValid(item: string): boolean {
        return (this.itemMap.get(item) == "TRUE");
    }
    
    isPropertyValid(item: string, property: string): boolean {
        
        if (item == null || property == null) {
            return false;
        }
        
        var propertyMap = this.propertiesMap.get(item);
        
        if (propertyMap) {
             return (propertyMap.get(property) == "TRUE");
        }
        else {
            false;
        }
    }
        
    private getMap(list: string[]): Map<string,string> {
        var map = new Map<string,string>();
        
        for (var i = 0, len = list.length; i < len; i++) {
            map[list[i]] = "TRUE";
        }
        
        return map;
    }
        
    private getListThatMatches(list: string[], searchStr: string): string [] {
        
        //console.log("searchStr=" + searchStr); 
        
        if (searchStr == null || searchStr === "" || list == null) {
            return null;
        }

        searchStr = searchStr.trim();
        
        if (searchStr === "") {
            return null;
        }
        
        if (list) {
            var result = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var prop = list[i];
                if (prop.indexOf(searchStr) > -1) {
                    result.push(prop);
                }
            }
            
            return result;
        }
        else {
            return null;
        }  
    }
}