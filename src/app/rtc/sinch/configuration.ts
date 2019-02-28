import { v4 as uuid } from 'uuid';

export enum AccountType {
    application = 0,
    user = 1
} 
export class Configuration {
    capabilities: { [capabilitiy: string]: boolean; } = { };
    supportActiveConnection: boolean;
}

export class Account {
    public id:string;
    public active:boolean = false;
    constructor(public type: AccountType, 
                public key:string, 
                public identity:string, 
                public secret:string, 
                public configuration:Configuration, 
                public name:string = null, 
                public description:string = null, 
                id:string = null,
                public platform:number = 0) {
        this.id = id ? id : uuid();
    }
}

export interface IAccountUpdated {
    onAccountUpdate();
}

export class Platform {
    urls:any
    constructor(prefix:string,
      public id:number,
      public name:string,
      public description:string) {
      this.urls = {
        base:this.getUrl("", prefix),
        portal:this.getUrl("portal", prefix),
        user:this.getUrl("user", prefix),
        reporting: this.getUrl("reporting", prefix),
        messaging: this.getUrl("messaging", prefix),
        calling: this.getUrl("calling", prefix)
      }
    }
    private getUrl(area:string, prefix:string, version:string = "v1"):string {
        if (prefix && prefix.includes("localhost")) {
            return "http://" + prefix + "/" + (area || "user") + "/" + version + "/" 
        }
        else if (prefix && prefix.includes(".com")) {
            return "https://" + prefix + "/" + (area || "user") + "/" + version + "/" 
        }
        else
            return "https://" + area + "api" + (prefix == null || prefix == "" ? "" : "-" + prefix) + ".sinch.com/" + version + "/"
    }
    
  }