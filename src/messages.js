import {Type, Field} from "protobufjs";

export const basic = new Type("BasicMessage")
    .add(new Field("timestamp", 1, "uint64"))
    .add(new Field("text", 2, "string"))
    .add(new Field("sender", 3, "string"))
    .add(new Field("version", 4, "int32"));