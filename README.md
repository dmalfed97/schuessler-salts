# Автоматизированная анкета для подбора солей Шюсслера
Работает на node v20, на yarn
По всем вопросам - tg @dmalfed

Команды:
- yarn install - установка пакетов
- yarn build - сборка бандла (готового приложения)
- yarn dev - запуск приложения в локальной среде в режиме разработки

- vercel - позволит производить выкатку на бесплатный удалённый сервер. Потребуется регистрация в сервисе vercel

В настоящий момент разворачивается с помощью серверов vercel - это бесплатно. В случае редактирования кода приложения, необходимо произвести его новую пересборку и выкатку на vercel. После этого, в месте использования необходимо заменить ссылку на развернутое приложение на новую, актуальную. Старая станет недоступна.

Пример источника данных для корректной работы приложения:
https://docs.google.com/spreadsheets/d/1V6u4y2-ctmQ_FdDtL_13nNnEnp6h1Qol/edit?usp=sharing&ouid=113048819080938888826&rtpof=true&sd=true

## Как работает приложение
Приложение предназначено для встройки в WordPress. В иных случаях без модификации кода работать не будет.
Обмен данными с WP идет через window.postMessage()

1. Для открытия первого шага анкеты с заполнением личных данных:
   - Через eventListener к postMessage из parentWindow необходимо отловить json объект с paymentId из postMessage **INITIAL_PAYLOAD**. Иначе анкета не откроется (src/App.tsx)
   - Также, после того как приложение анкеты смонтируется в iframe в DOM, в parentWindow уйдет postMessage **QUESTIONNAIRE_IFRAME_READY** для синхронизации
(Для локальной разработки закомментируйте код в App.tsx, опирающийся на наличие dataFromParent)
  
2. В url iframe анкеты (или в url в режиме разработки или прямого перехода по ссылке) необходимо указать query-param source, значение которого - ссылка на xlsx-документ с анкетой.

3. О правилах заполнения документов для корректной работы анкеты будет написано ниже

4. После перехода с последнего шага анкеты далее будет открыта вкладка с результатами. После предобработки в parentWindow уйдет postMessage **QUESTIONNAIRE_COMPLETE**, содержащий собранную в процессе работы анкеты персональную информацию, paymentId и подобранные в анкете товары.

5. В случае попытки пройти анкету заново (Кнопка - пройти снова) будет отправлен postMessage **NEW_QUESTIONNAIRE**, который можно будет использовать для сброса состояний на стороне parentWindow, например, в случае необходимости прохождения повторной оплаты.

### Правила заполнения .xlsx источника данных

1. В документе размеченном под анкету должно быть несколько обязательных вкладок, с точными названиями:
  - products - лист с информацией о продаваемых товарах. Обязательно должен содержать хотя бы 1 товар. Атрибуты в первом столбце менять нельзя.
  - groups - лист с информацией о принадлежности товара к той или иной группе товаровю Атрибуты в первом столбце менять нельзя
  - zodiac - зарезервированное имя под лист, который содержит какие-то баллы за соответствие тому или иному знаку зодиака. Названия знаков менять нельзя. **Лист не обязательный!**

2. Остальные вкладки - добавляются по мере необходимости и содержат информацию о шагах анкеты со сгруппированными вопросами.
  - Название вкладки - это название ссылки в меню навигации, будет отображаться в интерфейсе анкеты, в левой части
  - Ячейка А1 - содержит общую поясняющую информацию о шаге анкеты. Заполнение необязательно
  - Ячейки С1 и далее, в первой строке - содержат список названий товаров. Должны совпадать со списком во вкладке products
  - Столбец А со второй строки и далее - объявляет группы вопросов. Для корректной работы на вкладке должна быть хотя бы одна группа. Содержит информацию о названии группы вопросов. Если во втрой строке в столбце А заполняется ячейка, все остальные ячейки в этой строке необходимо оставить пустыми.
  - Столбец B - список вопросов. Все вопросы в системе - бинарные (Да/Нет (если еще точнее - Да/Нет/Не отмечено, где Не отмечено = Нет)) Со столбца С и далее содержит вес ответов для того или иного товара. Заполнять пустые ячейки нулями необязательно.

Если формат будет нарушен, система будет работать некорректно.

<img width="925" alt="Снимок экрана 2024-09-23 в 21 38 43" src="https://github.com/user-attachments/assets/7d139b14-329b-4ddc-b03c-fbfba3f5e598">

**Объяснение.**
В примере будет пояснение к шагу анкеты из ячейки А1.
Также, будет две группы вопросов - первая будет содержать вопросы со строки 3 по строку 11, вторая - с 13 и далее.
