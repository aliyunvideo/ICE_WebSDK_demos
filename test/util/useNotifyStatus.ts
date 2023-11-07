import { Subject, first ,filter} from 'rxjs';

export default function useNotifyStatus(page){
  const notifySubject = new Subject();
  page.exposeFunction('notifyStatus',(status,data)=>{
     notifySubject.next({status,data});
  });

  return {
     subject: notifySubject.asObservable(),
     waitUntil:(callback)=>{
      return new Promise((resolve,reject)=>{
        notifySubject.pipe(filter(
          (event)=>{
            return callback(event);
          }
         ),first()).subscribe({next:resolve,error:reject});
      });

     }
  }
}