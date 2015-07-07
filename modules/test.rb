
group = {childgroups: []}

list = [1,2,3,4,5,6]

group[:childgroups] = list.find_all do |num|
			num if num < 3
		end

p group