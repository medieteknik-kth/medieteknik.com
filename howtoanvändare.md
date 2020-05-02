# How to: Användare

## Hur vet jag vem som är inloggad i React?
Då kan du använda UserContext! Det gör du genom att importera:
```jsx
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
```
Sen kan du hämta vem som är inloggad med:
```jsx
const { user } = useContext(UserContext);
```
Om `user` är `null` så innebär det att ingen är inloggad.

Ifall du vill bara låta vissa användare se något så kan du validera med något i denna stil:
```jsx
// Ifall user inte är null så kollar den ifall denna användare har en nämndpost som har samma nämnd-id som committee.id.
const editingAllowed = user == null ? false : user.committeePostTerms.some((term) => term.post.committeeId === committee.id);
```
Vissa API-endpoints är begränsade till vissa inloggade användare, men allt det sköts automatiskt i Api.js. Om användaren inte får använda en endpoint kommer du få tillbaka ett error med statuskod 401 vilket du kan kolla när du får tillbaka ett svar från servern.

## Hur vet jag vem som är inloggad i Python?
Ifall du vill att en endpoint ska kräva inlogg kan du lägga @requires_auth framför. På detta sätt:
```python
@requires_auth
def post(self, user):
    # Ifall användaren måste ha speciella behörigheter kan du kolla user-objektet.
```

## Hur funkar ens inloggningen?
Det är lite bökigt eftersom att både frontenden och backenden måste veta vem som är inloggad. Enligt KTHs system är det bara backenden som faktiskt är inloggad och frontenden kan kolla vem som är inloggad genom att skicka en krypterad "token" till backenden som i sin tur dekrypterar och ser vilken användare som är kopplad till den.