class Variable

	attr_reader :voltage_level, 
				:vl_name, 
				:panel, 
				:system, 
				:ka_name, 
				:signal_name, 
				:symbaddr, 
				:variable_name, 
				:signal_short_name
				
	def initialize(variable)	
		#@errors = []
		create_headers(variable) unless variable.empty?
	end

	def create_headers(variable)			
	
		tag_name 			= variable[:tagname]			
						
		@voltage_level 		= get_voltage_level(tag_name)				#класс напряжения
		@vl_name 			= get_vl_name(tag_name)						#название линии
		@panel 				= get_panel(tag_name)						#номер панели
		@system 			= get_system(tag_name) 						#система
		@ka_name			= get_ka_name(tag_name)						#название ка (устройства)
		@signal_name 		= get_signal_name(tag_name)					#название сигнала
		@symbaddr 			= get_symbaddr(variable[:symbaddr])			#адрес 61850 (symbaddr)
		@variable_name 		= get_variable_name(variable[:name])		#адрес переменной (name) V460
		@signal_short_name 	= get_signal_short_name(variable[:name])	#короткое название сигнала
		
	end	

	def get_voltage_level(tag_name)	tag_name[0, 8].nil? ? "" : tag_name[0, 8].strip;	end
	def get_vl_name(tag_name)		tag_name[8, 27].nil? ? "" : tag_name[8, 27].strip;	end
	def get_panel(tag_name)			tag_name[35, 8].nil? ? "" : tag_name[35, 8].strip;	end
	def get_system(tag_name)		tag_name[43, 8].nil? ? "" : tag_name[43, 8].strip;	end
	def get_ka_name(tag_name)		tag_name[51, 27].nil? ? "" : clear_mip_tag(tag_name[51, 27]);	end
	def get_signal_name(tag_name) 	tag_name[78, 48].nil? ? "" : tag_name[78, 48].strip;	end
	def get_symbaddr(name)			name.nil? ? "" : name;	end
	def get_variable_name(name)		name.nil? ? "" : name;	end
	def get_signal_short_name(name)	name.include?(".") ? name[name.rindex(".")+1..-1] : "";	end
	def clear_mip_tag(tag)			tag.match(/(МИП.{4}\()/) ? tag[/\(.{1,}\)/].gsub(/\(|\)/, '') : tag.strip;	end
	
	def is_variable_ready?		
		!@variable_name.start_with?("INT.") && @variable_name.include?("!") && @variable_name.end_with?(".P")	
	end

	def get_long_vl_name	
		case @system
		when "МПРЗА" 	then @symbaddr.include?("MD") ? "#{@voltage_level} #{@vl_name} #{@ka_name}" : "#{@voltage_level} #{@vl_name}"
		when "АСУ ТП" 	then @ka_name.include?("ВЛ") ? 	"#{@voltage_level} #{@vl_name}" : "#{@voltage_level} #{@vl_name} #{@ka_name}"
		else "Undefine"			
		end
	end

	def eql?(name)					get_long_vl_name == name;	end

	def get_device_name	
		case @system
		when "АСУ ТП" 	then "МИП"
		when "МПРЗА" 	then "РЗА"
		else "Undefine"
		end
	end

	def get_prefix_device_name()	@variable_name.include?(".") ? @variable_name[0..@variable_name.rindex(".")-1] : "";	end
end