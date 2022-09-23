import {BatchRecorder, jsonEncoder} from "zipkin";
import { HttpLogger } from "zipkin-transport-http";
import ZipkinOpentracing from "zipkin-javascript-opentracing";
//import * as opentracing from "opentracing";

/* Zipkin compatible endpoint use port 9411  */
function tracer(){
  return new ZipkinOpentracing({
    serviceName: "frontend",
    recorder: new BatchRecorder({
      logger: new HttpLogger({
        endpoint: `/api/v2/spans`,
        jsonEncoder: jsonEncoder.JSON_V2
      })
    }),
    kind: "client"
  });
}

//opentracing.initGlobalTracer(tracer);
//const tracer = opentracing.globalTracer();
export default tracer;