# deletes all logs when greater than a specific size
find ~/ -maxdepth 1 -name "*.tlog*" -size +5M -delete
find ~/ardupilot*/logs -name "*.BIN" -size +5M -delete
find ~/blackbox -name "*.tlog" -size +5M -delete