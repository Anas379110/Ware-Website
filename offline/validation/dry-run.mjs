// Private offline metadata dry run. Never retrieves or publishes anything.
import {preflight} from './preflight.mjs';
const MAX_BYTES=1024*1024;
const MAX_ITEMS=100;
const emit=(value,status=0)=>{process.stdout.write(JSON.stringify(value)+'\n');process.exitCode=status;};
const deny=error=>emit({dryRun:true,error},2);
const chunks=[];
let bytes=0;
let oversized=false;
try {
  for await (const chunk of process.stdin) {
    bytes+=chunk.length;
    if(bytes>MAX_BYTES){oversized=true;break;}
    chunks.push(chunk);
  }
  if(oversized) deny('INPUT_TOO_LARGE');
  else {
    let data;
    try {data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));}
    catch {deny('INVALID_JSON');}
    if(process.exitCode!==2){
      if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).length!==1||!Array.isArray(data.items)) deny('INVALID_BATCH');
      else if(data.items.length>MAX_ITEMS) deny('BATCH_TOO_LARGE');
      else {
        const results=data.items.map((item,index)=>({index,...preflight(item)}));
        const eligible=results.filter(result=>result.eligible).length;
        emit({dryRun:true,counts:{total:results.length,eligible,denied:results.length-eligible},results});
      }
    }
  }
} catch {deny('INPUT_READ_FAILED');}
