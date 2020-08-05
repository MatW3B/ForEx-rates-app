# BigData3

## Opis Działania

Inicjalizacyjnie aplikacja wysyła zapytanie do api o pojedynczą tabelę w celu sporządzenia listy dostępnych walut do celów walidacyjnych oraz do ułatwienia korzystania poprzez listę sugestii.
Reaktywny formularz po pomyslnej walidacji przesyła wskazaną walutę oraz zakres dat do API. Jeśli data przekracza rok (limit API), wysyłana jest seria zapytań następujących po sobie. Otrzymane dane w odpowiedzi po parsowaniu zostają wykorzystane do obliczenia najdłuższego niemalejącego okresu kursu oraz do wykreślenia wykresu, na którym ten orkes jest zaznaczony.

### Architektura
Aplikacja składa się z dwóch kompontentów, które komunikują się ze sobą asynchronicznie. Ponadto w *shared* znajdują się pomocnicze funkcje używane przez oba komponenty. "Models" zawiera interfejsy służące do mapowania i operacji na pozyskanych danych.

## Biblioteki / Pakiety w użyciu
Angular10 jako framework, poza tym:
* rxJS, do komunikacji pomiędzy komponentami oraz parsowaniem i nasłuchiwaniem zapytań http
* angular Material, w celu łatwego definiowania aspektu wizualnego
* chart.js / ng2-charts
