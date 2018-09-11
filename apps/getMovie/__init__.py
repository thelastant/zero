import re

text = "◎片　　名　狄仁杰之四大天王/狄仁杰3◎"
a = re.compile(r'[◎](.*?)[◎]',re.S)
result = a.findall(text)

for x in result:
    print(x)
print(result)
