# 📡 Web Service - Shibboleth Connector

Ce **web service** permet de récupérer les informations d’un utilisateur authentifié via **Shibboleth**.

---

## ✅ Objectif

Exposer une API permettant d’obtenir les informations personnelles et académiques d’un utilisateur universitaire à partir de son identifiant Shibboleth.

---

## 🔗 Méthode HTTP

**POST**

---

## 🧾 En-têtes (Headers)

    Authorization: Bearer <connectorToken>
    Content-Type: application/json

- `Authorization` : jeton d’accès (`Bearer`) fourni par le système appelant  
- `Content-Type` : doit être défini sur `application/json`

---

## 📥 Corps de la requête (Body)

    {
      "login": "universityLogin",
      "clientUser": "universityLogin"
    }

> **Note** : Les champs `login` et `clientUser` correspondent à l’identifiant Shibboleth de l’utilisateur.  
> Ils sont généralement identiques, mais peuvent différer selon le contexte d’appel (ex. délégation).

---

## 📤 Réponse (200 OK)

    {
      "email": "contact@example.fr",
      "firstname": "John",
      "lastname": "Doe",
      "age": 18,
      "gender": "OTHER",
      "role": "STUDENT",
      "diploma": "Master",
      "departement": "Physique"
    }

---

## 📝 Détail des champs retournés

| Champ        | Type   | Description                                  | Exemple                  |
|--------------|--------|----------------------------------------------|--------------------------|
| `email`      | string | Adresse email de l’utilisateur               | john.doe@example.fr      |
| `firstname`  | string | Prénom                                        | John                     |
| `lastname`   | string | Nom de famille                                | Doe                      |
| `age`        | number | Âge                                           | 21                       |
| `gender`     | string | Sexe : MALE, FEMALE ou OTHER                 | OTHER                    |
| `role`       | string | Rôle : STUDENT ou STAFF                      | STUDENT                  |
| `diploma`    | string | Diplôme ou niveau d’étude actuel             | Master                   |
| `departement`| string | Département ou filière de rattachement       | Physique                 |


## 🧪 Exemple de requête `curl`

    curl -X POST https://api.example.com/shibboleth/connector \
      -H "Authorization: Bearer YOUR_CONNECTOR_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "login": "jdoe123",
        "clientUser": "jdoe123"
      }'

---

## 🧩 Remarques

- Le connecteur suppose que l’authentification Shibboleth a été effectuée en amont.
- Le champ `gender` permet une représentation inclusive : MALE, FEMALE ou OTHER.
- Le champ `role` permet de distinguer un étudiant (`STUDENT`) d’un membre du personnel (`STAFF`).

---
