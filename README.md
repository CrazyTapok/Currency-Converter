# Currency-Converter
Калькулятор валют для (BYN, USD, EUR). Для получения курсов валют использовалась API НацБанка РБ (!!! курсов конвертации EUR &lt;-> USD Нацбанк не предлагает, кросскурсы рассчитывать самостоятельно ). По умолчанию в инпуте выбора даты - сегодня, оно же и максимальное значние (value, max). Формат даты - YYYY-MM-DD (2020-12-08) для запроса на сервер банка. При получении курсов на определенное число курсы сохранять, запрашивать заново только если изменилась дата (то есть при другом просчете на ту же дату не делать запрос к API).
