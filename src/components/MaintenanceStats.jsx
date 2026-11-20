import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

function formatNumber(value) {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function formatServiceDate(dateString) {
    if (!dateString) {
        return 'No services yet';
    }

    const [year, month, day] = dateString
        .split('-')
        .map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    if (Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

function StatCard({
    icon,
    label,
    value,
    subtitle,
    style,
}) {
    return (
        <View style={[styles.statCard, style]}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={icon}
                    size={22}
                    color="#FF7A00"
                />
            </View>

            <Text style={styles.statLabel}>
                {label}
            </Text>

            <Text
                style={styles.statValue}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {value}
            </Text>

            {subtitle && (
                <Text style={styles.statSubtitle}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

export default function MaintenanceStats({
    records = [],
}) {
    const totalServices = records.length;

    const totalSpent = records.reduce(
        (total, record) => {
            const cost = Number(record.cost);

            if (!Number.isFinite(cost)) {
                return total;
            }

            return total + cost;
        },
        0
    );

    const lastServiceDate = records.reduce(
        (latestDate, record) => {
            if (!record.service_date) {
                return latestDate;
            }

            if (
                !latestDate ||
                record.service_date > latestDate
            ) {
                return record.service_date;
            }

            return latestDate;
        },
        null
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>
                    Maintenance Overview
                </Text>

                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />

                    <Text style={styles.liveText}>
                        LIVE DATA
                    </Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <StatCard
                    icon="construct-outline"
                    label="TOTAL SERVICES"
                    value={formatNumber(totalServices)}
                    subtitle="Maintenance records"
                    style={styles.halfCard}
                />

                <StatCard
                    icon="calendar-outline"
                    label="LAST SERVICE"
                    value={
                        lastServiceDate
                            ? formatServiceDate(
                                lastServiceDate
                            )
                            : '—'
                    }
                    subtitle="Most recent maintenance"
                    style={styles.halfCard}
                />

                <StatCard
                    icon="wallet-outline"
                    label="TOTAL SPENT"
                    value={`${formatNumber(totalSpent)} €`}
                    subtitle="Total maintenance expenses"
                    style={styles.fullCard}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 28,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        flexShrink: 1,
    },

    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#17362A',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    },

    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
    },

    liveText: {
        color: '#4ADE80',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    statCard: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 18,
        padding: 16,
        minWidth: 0,
    },

    halfCard: {
        flexGrow: 1,
        flexBasis: '45%',
    },

    fullCard: {
        width: '100%',
    },

    iconContainer: {
        width: 42,
        height: 42,
        backgroundColor: '#332519',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    statLabel: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.8,
        marginBottom: 8,
    },

    statValue: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    statSubtitle: {
        color: '#6B7280',
        fontSize: 11,
    },
});