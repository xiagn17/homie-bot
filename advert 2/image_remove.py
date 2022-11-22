import os, os.path
import time
from loguru import logger
from sys import stderr

logger.remove()
logger.add(stderr, format="<white>{time:HH:mm:ss}</white>"
                          " | <level>{level: <8}</level>"
                          " | <cyan>{line}</cyan>"
                          " - <white>{message}</white>")

def check_images():
    p='media'
    return [os.remove(file) for file in (os.path.join(path, file) for path, _, files in os.walk(p) for file in files) if os.stat(file).st_mtime < time.time() - 7 * 86400]
logger.debug(f"LAUNCHED IMAGE REMOVER")
while (True):
    time.sleep(1*3600)
    logger.debug("STARTING IMAGE REMOVE")
    result=len(check_images())
    logger.debug(f"REMOVED {result} IMAGES")
