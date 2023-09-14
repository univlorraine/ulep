# Universities pairing mode

Universities can have different pairing mode, which impact how a tandem is created / validated:

Here are the pre-requisites for a tandem to be created regarding the university pairing mode:
- `manual`: an admin from the university must validate tandem
- `semi-automatic`: an admin from the university or its tandem partner's university must validate the tandem
- `automatic`: no need for validation from this university

## Impact on Data model

```plantuml
class Organizations {
    id: string
    ---
    // Other fields
    pairingMode: string
}

note right of Organizations::pairingMode
    oneOf [
        "MANUAL",
        "SEMI_AUTOMATIC",
        "AUTOMATIC"
    ]
endnote

class Tandems {
    id: string
    ---
    // Other fields
    ---
    UniversityValidations: Organization[]
}

Tandems::UniversityValidations "n" -- "n" Organizations 
```

## Impact on use cases

### Create a tandem

Context: a tandem is suggested by individual routine but do not exist in database.

```plantuml
start
    :get universityId of admin who trigger the action;

    :partner = tandem user who's not from same university of admin;

    if (have a partner) then(no)
        ' If no partner then all users are from same university as admin 
        :CREATE tandem as ACTIVE;
    else (yes)
        :pairingMode = get partner's university pairing mode;
        switch (pairingMode?)
            case (manual)
                ' TODO(NOW): find way to distinguish validation
                ' Maybe store ID of last university/user which validate
                :CREATE tandem as VALIDATED;
            case (semi-automatic)
                :CREATE tandem as ACTIVE;
            case (automatic)
                :CREATE tandem as ACTIVE;
        endswitch
    endif

end
```

# Specific case to address

TODO: address these cases
- How to manage a tandem validated by 1st university if second university validate an other tandem (from individual routine for example)

# TODOs after

- Relaunch global routine if needed
- Side effect of a validation / creation (email ?)