import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const providers = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        rating: 4.8,
        experience: '8 years',
        consultationFee: 800,
        availability: 'Available now',
        image: null,
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Physiotherapy',
        rating: 4.9,
        experience: '12 years',
        consultationFee: 600,
        availability: 'Available in 2 hours',
        image: null,
    },
    {
        id: '3',
        name: 'Dr. Emily Davis',
        specialty: 'General Medicine',
        rating: 4.7,
        experience: '6 years',
        consultationFee: 500,
        availability: 'Available tomorrow',
        image: null,
    },
    {
        id: '4',
        name: 'Dr. Rajesh Kumar',
        specialty: 'Orthopedics',
        rating: 4.6,
        experience: '15 years',
        consultationFee: 1000,
        availability: 'Available now',
        image: null,
    },
];

const specialties = [
    'Cardiology',
    'Physiotherapy',
    'General Medicine',
    'Orthopedics',
    'Neurology',
    'Dermatology',
    'Pediatrics',
    'Gynecology',
];

export const SearchScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [filteredProviders, setFilteredProviders] = useState(providers);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = providers.filter(provider =>
            provider.name.toLowerCase().includes(query.toLowerCase()) ||
            provider.specialty.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProviders(filtered);
    };

    const handleSpecialtyFilter = (specialty: string) => {
        if (selectedSpecialty === specialty) {
            setSelectedSpecialty(null);
            setFilteredProviders(providers);
        } else {
            setSelectedSpecialty(specialty);
            const filtered = providers.filter(provider =>
                provider.specialty === specialty
            );
            setFilteredProviders(filtered);
        }
    };

    const renderProvider = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.providerCard}>
            <View style={styles.providerImage}>
                <Icon name="person" size={40} color="#6B7280" />
            </View>
            <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{item.name}</Text>
                <Text style={styles.providerSpecialty}>{item.specialty}</Text>
                <View style={styles.providerDetails}>
                    <View style={styles.ratingContainer}>
                        <Icon name="star" size={16} color="#F59E0B" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.experience}>{item.experience}</Text>
                </View>
                <Text style={styles.availability}>{item.availability}</Text>
                <View style={styles.providerFooter}>
                    <Text style={styles.consultationFee}>₹{item.consultationFee}</Text>
                    <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Find Providers</Text>
                <Text style={styles.headerSubtitle}>Search for doctors and therapists</Text>
            </LinearGradient>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={20} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or specialty"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity>
                        <Icon name="filter-list" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Specialty Filters */}
            <View style={styles.specialtyContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {specialties.map((specialty) => (
                        <TouchableOpacity
                            key={specialty}
                            style={[
                                styles.specialtyChip,
                                selectedSpecialty === specialty && styles.specialtyChipSelected,
                            ]}
                            onPress={() => handleSpecialtyFilter(specialty)}
                        >
                            <Text
                                style={[
                                    styles.specialtyText,
                                    selectedSpecialty === specialty && styles.specialtyTextSelected,
                                ]}
                            >
                                {specialty}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Results */}
            <View style={styles.resultsContainer}>
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                        {filteredProviders.length} providers found
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.sortText}>Sort by</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredProviders}
                    renderItem={renderProvider}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.providersList}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    searchContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    specialtyContainer: {
        paddingVertical: 16,
        paddingLeft: 24,
    },
    specialtyChip: {
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
    },
    specialtyChipSelected: {
        backgroundColor: '#3B82F6',
    },
    specialtyText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    specialtyTextSelected: {
        color: '#fff',
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultsCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    sortText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
    providersList: {
        paddingBottom: 20,
    },
    providerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    providerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    providerInfo: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    providerSpecialty: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    providerDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    rating: {
        fontSize: 14,
        color: '#1F2937',
        marginLeft: 4,
        fontWeight: '500',
    },
    experience: {
        fontSize: 14,
        color: '#6B7280',
    },
    availability: {
        fontSize: 12,
        color: '#10B981',
        marginBottom: 12,
    },
    providerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    consultationFee: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    bookButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
