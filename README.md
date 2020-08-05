# BigData3

## Opis Działania

Inicjalizacyjnie aplikacja wysyła zapytanie do api o pojedynczą tabelę w celu sporządzenia listy dostępnych walut do celów walidacyjnych oraz do ułatwienia korzystania poprzez listę sugestii.
Reaktywny formularz po pomyslnej walidacji przesyła wskazaną walutę oraz zakres dat do API. Otrzymane dane w odpowiedzi po parsowaniu zostają wykorzystane do obliczenia najdłuższego niemalejącego okresu kursu oraz do wykreślenia wykresu, na którym ten orkes jest zaznaczony.

## Biblioteki / Pakiety w użyciu
Angular10 jako framework, poza tym:
* rxJS, do komunikacji pomiędzy komponentami oraz parsowaniem i nasłuchiwaniem zapytań http
* angular Material, w celu łatwego definiowania aspektu wizualnego
* chart.js / ng2-charts