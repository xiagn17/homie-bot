from pathlib import Path

folder = str(Path(__file__).parent.absolute())

stations = {}

with open(folder+'/stations.csv', 'r') as f:  # open the file
    lines = f.readlines()  # put the lines to a variable (list).
    for line in lines:
        line = line.replace('\n', '')
        line = line.lower()
        values = line.split(':')
        stations[values[0]] = (int(values[1]), values[2])

# print(stations)
