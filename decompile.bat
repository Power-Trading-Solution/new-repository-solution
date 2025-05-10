SET PATH1C="C:\Program Files (x86)\1cv8t\8.3.24.1342\bin\1cv8t.exe"
SET EXT="C:\Users\turen\OneDrive\Документы\4-course\вкр\сборкаВнешнейОбработки\РММ.epf"
SET SRC="C:\Users\turen\OneDrive\Документы\4-course\вкр\сборкаВнешнейОбработки\тестСборки"
SET OUT="C:\Users\turen\OneDrive\Документы\4-course\вкр\сборкаВнешнейОбработки\тестСборки\out.txt"
%PATH1C% DESIGNER /DumpExternalDataProcessorOrReportToFiles %SRC% %EXT% /Out %OUT%