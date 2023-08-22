```plantuml
start
:profileToPair = Profiles from selected universities not in tandem;
note
    May be updated in further time in order to
    manage several proposition or tandems per profile but excluding proposistions/tandems already made
endnote

:[groupA, groupB] = Split profiles into 2 groups;
note
    Currently, profiles are arbitrary splited in 2 at half
endnote

group Generate possible pairs between (groupA, groupB) sorted by preference
    repeat :profile1 = select next profile from group A;
        repeat :profile2 = select from group B;
            :score = computeScore(profile1, profile2);
            note
                score == 0 if pair match forbidden cases
                TODO: detail score computation
            endnote
        repeat while (next profile2 in group B?)
    repeat while (next profile1 in group A?)

    :preferenceGroupA = map profile index from group A with profile index from group B sorted by descending score;
end group
floating note: Pairs possibilities and preferences\nare generated for (groupA, groupB)\nand (groupB, groupA)

group Global routine: find best combinaisons among possible pairs
    :createdPairs = empty array of n pairs to be created
    n = min (groupA.length, groupB.length);
    :freeProposerList = groupA;

    repeat :freeProposer = select next free proposer (i.e. proposer without a pair) from freeProposerList;
        repeat :acceptor = select proposer's next preferred acceptor;
            if (acceptor already have a pair?) then(no)
                :save pair(freeProposer, acceptor) in createdPairs;
                :remove freeProposer from freeProposerList;
                break
            else (yes)
                :existingProposer = proposer with whom the acceptor is in pair;
                if (freeProposer is a better match for acceptor than existingProposer?) then(yes)
                    :remove pair(existingProposer, acceptor) from createdPairs;
                    :save pair(freeProposer, acceptor) in createdPairs;
                    :add existingProposer at start of freeProposerList;
                    :remove freeProposer from freeProposerList;
                else (no)
                endif
            endif
        repeat while (remain available acceptors for freeProposer in group B ?)
    repeat while (nb of created pairs < n ?)
end group

:save all pairs with score > 0.5 as Draft tandems;

end
```

Note current restrictions that will probably be challenged or  be lifted later:
- 1 tandem per profile max
- 1 tandem proposition per profile
- Priorities
- Discover langage only with joker language