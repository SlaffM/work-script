

vl_groups = {childgroups: ""}

variables = [1,2,3,4,5,6,7,8,9,10]

vl_groups[:childgroups] = variables.map do |variable|				

	"#{variable} _ "	if variable == 3					

end


p vl_groups