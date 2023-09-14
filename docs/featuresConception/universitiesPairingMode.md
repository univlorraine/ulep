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

    if (have a partner) then(false)
        ' If no partner then all users are from same university as admin 
        :CREATE tandem as ACTIVE AND
            validation from admin's university;
    else (true)
        :pairingMode = get partner's university pairing mode;
        switch (pairingMode?)
            case (manual)
                :CREATE tandem with
                status TO_VALIDATE AND
                validation from admin's university;
            case (semi-automatic)
                :CREATE tandem as ACTIVE AND
                validation from admin's university;
            case (automatic)
                :CREATE tandem as ACTIVE AND
                validation from admin's university;
        endswitch
    endif
end
```


### Validate a tandem

Context:
- A tandem has been proposed by global routine (i.e. exist in DB with status `DRAFT`) OR
- A tandem has been created after suggestion by individual routine but due to universities pairing mode it's waiting for validation from an university (i.e. exist in DB with a status like `VALIDATED_UNIVERSITY_1`)

```plantuml
start
    :adminUniversity = get university of admin who trigger the action;
    :tandem = get tandem;

    :tandemUniversities = tandem's users universities;

    if (tandemUniversities include adminUniversity?) then (true)
        :partner = tandem user who's not from adminUniversity;

        if (tandem status is "DRAFT"
        OR "VALIDATED_UNIVERSITY_1"?) then(false)
            stop
        else (true)
            if (tandem users are from same university?) then(true)
                :UPDATE tandem with
                status ACTIVE AND
                validation from adminUniversity;
            else (false)
                if (tandem status?) then (DRAFT)
                    :pairingMode = partner's university pairing mode;

                    switch (pairingMode?)
                        case (manual)
                            :UPDATE  tandem with
                            status TO_VALIDATE AND
                            validation from adminUniversity;
                        case (semi-automatic)
                            :UPDATE tandem as ACTIVE AND
                            validation from adminUniversity;
                        case (automatic)
                            :UPDATE tandem as ACTIVE AND
                            validation from adminUniversity;
                    endswitch
                else (VALIDATED_UNIVERSITY_1)
                    :get tandem's university validation;
                    
                    if (adminUniversity is in tandem's validation) then (true)
                        ' Admin's university has already validated this tandem
                        stop
                    else (false)
                        :UPDATE tandem as ACTIVE AND
                        validation from adminUniversity;
                    endif

                endif
            endif
        endif
    else (false)
        stop
    endif

end

```

### Global routine execution

See [dedicated README](./generateTandemsRoutines.md) for algorithm details.

When a tandem is picked by global routine, check if tandems users university are both in automatic pairing mode. If that's the case, then create tandem with status "ACTIVE".


## TODOs

1. Add university's pairing mode and ability to update them through Backoffice
2. Impact on tandem creation / validation usecases
3. IHM validation / creation 

Specific case to address:
- How to manage a tandem validated by 1st university if second university validate an other tandem (from individual routine for example)

After:
- Relaunch global routine if needed
- Refusal of tandem
- Side effect of a validation / creation (email ?)