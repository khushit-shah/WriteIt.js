"""
On Every change:
send request to google closure compiler!
download the compiled script and write it to WriteIt.min.js
"""
import os
import time
import requests

FILE_PATH = "../WriteIt.js"
OUT_FILE_PATH = "../WriteIt.min.js"
CLOSURE_API_URL = "https://closure-compiler.appspot.com/compile"
COMPILATION_LEVEL = "ADVANCED_OPTIMIZATIONS"


def getCompiledCode(jscode):
    params = {
        "js_code": jscode,
        "compilation_level": COMPILATION_LEVEL,
        "output_format": "text",
        "output_info": "compiled_code"
    }
    result = requests.post(CLOSURE_API_URL, data = params)

    if(result.status_code < 200 or result.status_code >= 300):
        print(result.status_code, result.text)
        raise Exception("Some Error Occured!")

    return result.text


def compileAndSave():
    jscode = open(FILE_PATH, 'r+').read()
    compiledCode = getCompiledCode(jscode)
    open(OUT_FILE_PATH, "w+").write(compiledCode)

fileStamp = os.stat(FILE_PATH).st_mtime

while True:
    time.sleep(1)
    if fileStamp != os.stat(FILE_PATH).st_mtime:
        compileAndSave()
        fileStamp = os.stat(FILE_PATH).st_mtime
