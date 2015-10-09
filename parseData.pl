#!/usr/local/bin/perl

my $file = "./bc.data";

open my $FILE, '<', $file or die "Cannot open " . $file;

while (<$FILE>) {
    my $line = $_;

    if ( $line =~/^Candidate\s+Party/) {
        ## header... continue... 
    }
    elsif ( $line =~ /^(.+) \((.+)\)/) {
        $index++;
        $riding = $1;
        $date = $2;

        $Results[$riding]['name'] = $riding;
        $Results[$riding]['date'] = $date;
        print "** $riding ** ($date)\n";
    }
    elsif ( $line =~/\S/) {
        my @results = split /\s+/, $line;
        
        my $index = getParty(\@results);
        my $i= $index->[0];
        my $j = $index->[1];
        
        if ($i) { 
            my $party = $results[$i];
            $Results[$riding][$party] = $results[-1];
            
            insert($riding, $date, $party, $results[$j]);
        }
    }
    elsif ($line = /^\s*$/) {
        ## empty 
    }
    else {
        print "** Undefined Line: $line\n";
    }

}

print "\n****\n";

exit;

#############
sub insert {
#############
    my $riding = shift;
    my $date = shift;
    my $party = shift;
    my $count = shift;

    $count =~s/,//g; ## remove commas (eg 1,300 -> 1300)

    print "$party : $count ($riding - $date) \n";
    my $sql = "INSERT INTO Votes VALUES ('','$riding','$party','$date', $count)";
    
    print "$sql\n";

    `mysql -u tester -ptestpass -h limsdemo.bcgsc.ca leadnow -e "$sql"`;
    return $ok;
}

###############
sub getParty {
###############
    my $results = shift;
    my $party = $results[$i];

    my $i = 2;
    my $columns = int(@$results);
        
    while ($i < $columns && $results->[$i] !~/^(C|N\.D\.P\.|Lib|G\.P\.|PC|Ind\.|C\.H\.P\.|M\.\-L\.|Libert\.|Comm\.|WBP|Pirate|MP|Action)$/) {
        $i++;
    }
   
    if ($i < $columns) {
        $party = $results->[$i-1];
        
        if ($party == 'PC' && $results->[$i] == 'Party') { 
            ## this one was poorly entered ... needs to be manually adjusted ... ##
            $party = 'PC Party';
            $i++;
        }
    }
    else {
        print "******************* Party Undefined from : @$results... \n";
        print "'$results->[2]' or '$results->[3]'\n";
        return;
    }

    my $j = $i+1;
    
    while ( ($j < $columns) && ($results->[$j] !~/^[\d+\,]/)) { 
        $j++;
    }
    if ($j >= $columns) {
        print "MISSING RESULTS ?\n";
        $j = 0; 
    }

    return [$i-1, $j];
}
     
