class ModelHelper	
		
		def initialize(variables)
			@uuid = UUID.new
			@variables = select_variables variables				
			@list_groups = get_list_groups			
		end		

		def prepare_model
			@list_groups.each do |vl_group|
				vl_group[:guid]			= @uuid.generate
				vl_group[:childgroups] 	= get_device_group(vl_group)
			end
		end

		private
		
			def change_device_name(name, num)
				name.include?("МИП") ? "#{name}_1" : "#{name}_#{num}"
			end		
	
			def ti_list
				['Ia', 'Ib', 'Ic', 'Ua', 'Ub', 'Uc', 'P']
			end
	
			def get_ti_struct			
				ti_list.map { |elem| {group:[{name: elem, guid: @uuid.generate}]} }			
			end

			def select_variables(variables)
				variables.select { |variable| variable if variable.is_variable_ready? }
			end
	
			def get_list_groups	
				@variables.map { |variable| { name: variable.get_long_vl_name, guid: "", childgroups: [] } }.uniq
			end

			def get_device_group(vl_group)
				group = @variables.map { |variable| create_device(variable) if variable.eql?(vl_group[:name]) }.compact
				
				num = 1
				group.each do |device|					
					device[:group][0][:name] = change_device_name(device[:group][0][:name], num)
					num += 1
				end				
			end			
	
			def create_device(variable)			
				group 				= 	{ 	group: [] }
				group[:group][0] 	= 	{ 
											name: 			variable.get_device_name,
											guid: 			@uuid.generate,
											device: 		variable.get_prefix_device_name,
											childgroups: 	get_ti_struct
										}
				return group
			end

end