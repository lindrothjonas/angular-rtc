import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class LocalStorageService {
  private tables: Map<String, Map<String, any>>
  public data:Map<string, Subject<any[]>>
  constructor(protected localStorage: LocalStorage) { 
    this.tables = new Map<String, Map<String, any>>()
    this.data = new Map<string, Subject<any[]>>()
  }

  getData(table:string):Subject<any[]> {
    if (this.data[table] == null) {
      this.data[table] = new Subject()
      
    }
    this.getAll(table).subscribe((accounts) => {
      this.data[table].next(accounts)
    })
    return this.data[table];
  }
  tableUpdated(table:string):void {
    if (this.data[table]) {
      this.data[table].next(Array.from(this.tables[table].values()));
    } 
  }
  set(table:string ,data:any):Observable<any> {
    if (data.id == null) {
      data.id = uuid()
    }
    if (this.tables[table] == null) {
      this.tables[table] = new Map<string, any>()    
    }
    this.tables[table].set(data.id, data)
    this.tableUpdated(table)
    return this.localStorage.setItem(table, this.tables[table]).pipe(tap( () => {}), catchError((err1, err2) => { console.log(err1);return null}))
  }

  remove (table:string, id:string):Observable<any> {
    
    this.tables[table].delete(id)
    this.tableUpdated(table)
    return this.localStorage.setItem(table, this.tables[table])
  }

  get(table:string, id:string):Observable<any> {
    return new Observable((observable) => {
      this.getAll(table).subscribe((accounts) => {  
        observable.next(this.tables[table].get(id))
        
      });
    });
  }


  getAll(table:string):Observable<any[]> {
    return new Observable((observable) => {
      this.localStorage.getItem(table).pipe().subscribe((accounts) => 
        { 
          this.tables[table] = accounts == null ? new Map<string, any>() : accounts
          observable.next(Array.from(this.tables[table].values()))           
        });
      });
  }
  
}
